<?php
if (!defined('_PS_VERSION_')) {
    exit;
}

class Test extends Module
{
	
    public function __construct()
    {
        $this->name = 'test';
        $this->tab = '';
        $this->version = '1.0';
        $this->author = 'Khouloud KAMMOUN';
        $this->need_instance = 0;
		
		parent::__construct();
		
		$this->displayName = $this->trans('Test');
        $this->description = $this->trans('Test.');
        $this->ps_versions_compliancy = array('min' => '1.7.1.0', 'max' => _PS_VERSION_);
    }

    public function install()
    {
        return (parent::install() && $this->registerHook('dashboardZoneTwo'));
    }

    public function getContent()
    {
   
	return "hello!";
        
        }
		 public function hookDashboardZoneTwo($params)
    {
		return "hello!";
	}
}

?>