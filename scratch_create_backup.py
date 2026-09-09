import os
import zipfile

def create_backup():
    backup_name = '../hum_fleet_final_backup.zip'
    print(f"Creating backup: {backup_name}...")
    
    with zipfile.ZipFile(backup_name, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk('.'):
            # Exclude node_modules, .git, and existing large zip files
            if 'node_modules' in dirs:
                dirs.remove('node_modules')
            if '.git' in dirs:
                dirs.remove('.git')
            
            for file in files:
                if file.endswith('.zip'):
                    continue
                file_path = os.path.join(root, file)
                zipf.write(file_path, os.path.relpath(file_path, '.'))
                
    print(f"Backup created successfully at: {os.path.abspath(backup_name)}")

create_backup()
