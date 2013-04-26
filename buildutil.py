from jenkins import Jenkins
from jinja2 import Template

class TaskBuilder:

  def __init__(self, jenkinsURL):
    self.j = Jenkins(jenkinsURL)
    self.jobName = ""
    with open("config.xml") as file:
      self.templateConfig = file.read()
    self.template = Template(unicode(self.templateConfig))

  def set_new_config(self, **params):
    self.newConfig = self.template.render(repos=params['repos'], description=params['repos'])

  def add_build(self, **params):
    self.set_job_name(**params)
    self.set_new_config(**params)

    if self.j.job_exists(self.jobName):
      self.do_build(**params)
    else:
      self.j.create_job(self.jobName, self.newConfig)
      self.do_build(**params)

  def do_build(self, **params):
    self.set_job_name(**params)
    self.set_new_config(**params)

    self.j.enable_job(self.jobName)
    self.j.build_job(self.jobName, {'branch': params['branch'], 'version': params['version'], 'styleguide_repo': params['styleguide_repo'],
      'styleguide_branch': params['styleguide_branch'], 'sidecar_repo': params['sidecar_repo'], 'sidecar_branch': params['sidecar_branch'],
      'package_list': params['package_list']})

  def set_job_name(self,**params):
    buildUtil = BuildUtil()
    self.jobName = buildUtil.get_job_name(repos=params['repos'])

  def get_build_status(self, **params):
    #job_info = self.j.get_job_info(self.jobName)
    #return build_status
    pass

  def get_job_name(self):
    return self.jobName

class BuildUtil:
  def __init__(self):
    pass
  
  def get_md5(self, string):
    try:
      import hashlib
      md5_str = hashlib.md5(string).hexdigest()
    except Exception:
      import md5
      md5_str = md5(string).hexdigest()

    return md5_str

  def get_job_name(self, **params):
    return 'Build' + '_' + self.get_md5(params['repos'])

  # checks for default styleguide params, if present adds _version to branch name
  def determine_styleguide_branch(params):
    if params.styleguide_repo == "git@github.com:sugarcrm/styleguide.git" and params.styleguide_branch == "master":
      return "%s_%s" % (params.styleguide_branch, params.version)
    else:
      return params.styleguide_branch
