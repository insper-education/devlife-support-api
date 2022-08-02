import subprocess
from concurrent.futures import ThreadPoolExecutor
from .models import Offering
from django.conf import settings

repository_operations_pool = ThreadPoolExecutor(max_workers=1)

def clone_repository(offering: Offering):
    def do_clone(offering: Offering):
        repo_status = offering.get_repo_status_display()
        if offering.repo_url == '':
            Offering.objects.filter(id=offering.id).update(repo_status='EMPTY')
            return 

        if repo_status == 'EMPTY' and offering.repo_url != '':
            try:
                Offering.objects.filter(id=offering.id).update(repo_status=Offering.RepoStatus.CLONING)
                repo_url_no_https = offering.repo_url.replace('https://', '')
                st = subprocess.run(['git', 'clone', f'https://{offering.repo_user}:{offering.repo_token}@{repo_url_no_https}', offering.filesystem_path], cwd=settings.REPOSITORY_ROOT)
                if st.returncode == 0:
                    Offering.objects.filter(id=offering.id).update(repo_status=Offering.RepoStatus.READY)
                else:
                    Offering.objects.filter(id=offering.id).update(repo_status=Offering.RepoStatus.ERROR)
            except Exception as e:
                Offering.objects.filter(id=offering.id).update(repo_status=Offering.RepoStatus.ERROR)
    
    repository_operations_pool.submit(do_clone, offering)


def update_repository(offering: Offering):
    def do_update(offering: Offering):
        if offering.repo_status != Offering.RepoStatus.READY:
            return
        
        try:
            Offering.objects.filter(id=offering.id).update(repo_status=Offering.RepoStatus.UPDATING)
            st = subprocess.run('git pull'.split(), cwd=offering.filesystem_path)
            if st.returncode == 0:
                Offering.objects.filter(id=offering.id).update(repo_status=Offering.RepoStatus.READY)
            else:
                print('git:', st.returncode)
                Offering.objects.filter(id=offering.id).update(repo_status=Offering.RepoStatus.ERROR)

        except Exception as e:
            print(e, offering.filesystem_path)
            Offering.objects.filter(id=offering.id).update(repo_status=Offering.RepoStatus.ERROR)
    
    repository_operations_pool.submit(do_update, offering)
