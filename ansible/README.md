# How to configure deploys using Ansible

Three environments are currently defined : 
- dev
- preprod
- prod

IP Connection to these environments are described in inventories/dev.yaml, inventories/preprod.yaml, inventories/prod.yaml in the k3s_master_host directives.

Link between these environments and the branches they are connected to is specified in gitlab-ci.yaml deploy scripts, for each deploy so that it is configurable easily and in only one file. Advantage of doing this is that branches notion is agnostic to the deploy pipeline.

Thus, if you want to add an environment you have to : 

- Add corresponding inventory in ansible/inventories/YOUR_ENV.yml
- Connect your env to a branch in the CASE section of the script in deploys

## Command workflow

ansible-playbook -i ansible/inventory/preprod.yml ansible/deploy_backend.yml --vault-password-file=vault-pass.txt


