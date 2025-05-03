from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import pymysql
import enum
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.environ.get('DATABASE_USER')}:{os.environ.get('DATABASE_PASSWORD')}@{os.environ.get('DATABASE_HOST')}/{os.environ.get('DATABASE_NAME')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)

class JobStatus(enum.Enum):
    APPLIED = 'Applied'
    INTERVIEWING = 'Interviewing'
    OFFERED = 'Offered'
    REJECTED = 'Rejected'
    PENDING = 'Pending'

db = SQLAlchemy(app)

class JobApplication(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company = db.Column(db.String(100), nullable=False)
    position = db.Column(db.String(100), nullable=False)
    status = db.Column(db.Enum(JobStatus), nullable=False)
    date_applied = db.Column(db.Date, nullable=False)
    location = db.Column(db.String(100), nullable=True)
    salary = db.Column(db.Float, nullable=True)

    __table_args__ = (
        db.Index('ix_job_date_applied_btree', 'date_applied'),
        db.Index('ix_job_location_btree', 'location'),
        db.Index('ix_job_date_location_status_btree', 'date_applied', 'location', 'status'),
    )


@app.route('/jobs', methods=['POST'])
def add_job():
    data = request.json
    new_job = JobApplication(
        company=data['company'],
        position=data['position'],
        status=data['status'],
        date_applied=data['date_applied'],
        location=data.get('location'),
        salary=data.get('salary')
    )
    db.session.add(new_job)
    db.session.commit()
    return jsonify({"message": "Job application added successfully"}), 201

@app.route('/jobs', methods=['GET'])
def get_jobs():
    jobs = JobApplication.query.all()
    return jsonify([{ 'id': job.id, 'company': job.company, 'position': job.position, 'status': job.status.value, 'date_applied': job.date_applied.strftime('%Y-%m-%d'), 'location': job.location, 'salary': job.salary } for job in jobs])

@app.route('/jobs/<int:job_id>', methods=['PUT'])
def update_job(job_id):
    data = request.json
    job = JobApplication.query.get(job_id)
    if not job:
        return jsonify({"message": "Job application not found"}), 404
    
    job.company = data.get('company', job.company)
    job.position = data.get('position', job.position)
    job.status = data.get('status', job.status)
    job.date_applied = data.get('date_applied', job.date_applied)
    job.location = data.get('location', job.location)
    job.salary = data.get('salary', job.salary)
    
    db.session.commit()
    return jsonify({"message": "Job application updated successfully"})

@app.route('/jobs/<int:job_id>', methods=['DELETE'])
def delete_job(job_id):
    job = JobApplication.query.get(job_id)
    if not job:
        return jsonify({"message": "Job application not found"}), 404
    
    db.session.delete(job)
    db.session.commit()
    return jsonify({"message": "Job application deleted successfully"})

@app.route('/locations', methods=['GET'])
def get_locations():
    locations = db.session.query(JobApplication.location)\
        .filter(JobApplication.location.isnot(None))\
        .distinct()\
        .all()
    
    location_list = [loc[0] for loc in locations]
    return jsonify(location_list)

@app.route('/report', methods=['GET'])
def report():
    location = request.args.get('location')
    status = request.args.get('status')
    start_date = request.args.get('start_date', '1970-01-01')
    end_date = request.args.get('end_date', '2100-01-01')

    query_filters = "WHERE date_applied BETWEEN %s AND %s"
    params = [start_date, end_date]

    if location:
        query_filters += " AND location = %s"
        params.append(location)
    if status:
        query_filters += " AND status = %s"
        params.append(status)

    connection = pymysql.connect(
        host=os.environ.get('DATABASE_HOST'),
        user=os.environ.get('DATABASE_USER'),
        password=os.environ.get('DATABASE_PASSWORD'),
        database=os.environ.get('DATABASE_NAME'),
        cursorclass=pymysql.cursors.DictCursor
    )
    
    try:
        with connection.cursor() as cursor:
            
            cursor.execute(f"""
                SELECT id, company, position, status, date_applied, location, salary
                FROM job_application
                {query_filters}
            """, params)
            job_results = cursor.fetchall()

            # Total applications
            cursor.execute(f"SELECT COUNT(*) as total FROM job_application {query_filters}", params)
            total_applications = cursor.fetchone()['total']

            # Average salary
            cursor.execute(f"SELECT AVG(salary) as avg_salary FROM job_application {query_filters} AND salary IS NOT NULL", params)
            avg_salary = cursor.fetchone()['avg_salary']

            # Status breakdown
            cursor.execute(f"""
                SELECT status, COUNT(*) as count
                FROM job_application {query_filters}
                GROUP BY status
            """, params)
            status_breakdown = {row['status']: row['count'] for row in cursor.fetchall()}

            # Location breakdown
            cursor.execute(f"""
                SELECT location, COUNT(*) as count
                FROM job_application {query_filters}
                GROUP BY location
            """, params)
            location_breakdown = {row['location']: row['count'] for row in cursor.fetchall()}

            # Earliest and latest application dates
            cursor.execute(f"""
                SELECT MIN(date_applied) as earliest, MAX(date_applied) as latest
                FROM job_application {query_filters}
            """, params)
            dates = cursor.fetchone()
    finally:
        connection.close()

    return jsonify({
        "filters": {
            "start_date": start_date,
            "end_date": end_date,
            "location": location,
            "status": status
        },
        "total_applications": total_applications,
        "average_salary": avg_salary,
        "status_breakdown": status_breakdown,
        "location_breakdown": location_breakdown,
        "earliest_application": dates['earliest'].strftime('%Y-%m-%d') if dates['earliest'] else None,
        "latest_application": dates['latest'].strftime('%Y-%m-%d') if dates['latest'] else None,
        "results": job_results
    })


with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=5001)