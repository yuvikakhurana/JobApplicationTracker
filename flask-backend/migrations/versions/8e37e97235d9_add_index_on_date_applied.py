"""Add index on date_applied

Revision ID: 8e37e97235d9
Revises: 
Create Date: 2025-05-02 04:35:54.062511

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8e37e97235d9'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('job_application', schema=None) as batch_op:
        batch_op.create_index('ix_job_date_applied_btree', ['date_applied'], unique=False, mysql_using='BTREE')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('job_application', schema=None) as batch_op:
        batch_op.drop_index('ix_job_date_applied_btree', mysql_using='BTREE')

    # ### end Alembic commands ###
