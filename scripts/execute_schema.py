import os
import psycopg2

def execute_sql_file(database_url, sql_file_path):
    try:
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        with open(sql_file_path, 'r') as f:
            sql_commands = f.read()
        cur.execute(sql_commands)
        conn.commit()
        cur.close()
        conn.close()
        print(f"Successfully executed {sql_file_path}")
    except Exception as e:
        print(f"Error executing SQL file: {e}")

if __name__ == "__main__":
    database_url = "postgresql://TechZolo2025@db.zsojqptmwdmvdlokhzir.supabase.co:5432/postgres"
    sql_file = "c:\\Users\\vikas\\Downloads\\tech-zolo\\scripts\\database_schema.sql"
    execute_sql_file(database_url, sql_file)