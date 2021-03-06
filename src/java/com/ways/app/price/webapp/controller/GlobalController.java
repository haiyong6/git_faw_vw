package com.ways.app.price.webapp.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ExtendedModelMap;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.ways.app.framework.utils.AppFrameworkUtil;
import com.ways.app.framework.utils.DateUtil;
import com.ways.app.price.service.IGlobalManager;
import com.ways.framework.base.BaseController;

/**
 * 初始化控件
 * @author yinlue
 *
 */
@Controller
public class GlobalController extends BaseController{
	
	protected final Log log = LogFactory.getLog(GlobalController.class);
	@Autowired
	private IGlobalManager globalManager;
	 
	/**
     * 获取初始化城市控件值
     * @return
     * @throws Exception
     */
    @RequestMapping("/global/getCityModal")
    public ModelAndView getCityModal(HttpServletRequest request,HttpServletResponse response) throws Exception
    {	
    	
    	Map<String, Object> paraMap = getPageParams(request);
    	DateUtil.getTPMix_Date(paraMap);
    	globalManager.getCityModal(request,paraMap);
        return new ModelAndView("/global/cityModal",new ExtendedModelMap().asMap());
    }
    
    /**
     * 获取初始化子车型控件值
     * @return
     * @throws Exception
     */
    @RequestMapping("/global/getSubmodelModal")
    public ModelAndView getSubmodelModal(HttpServletRequest request,HttpServletResponse response) throws Exception
    {
    	Map<String, Object> map = getPageParams(request);
    	globalManager.getSubmodelModal(request,map);
    	//返回细分市场页
    	if("2".equals(map.get("subModelShowType"))) return new ModelAndView("/global/subModelModaBySegmentl",new ExtendedModelMap().asMap());
    	//返回品牌页
    	else if("3".equals(map.get("subModelShowType"))) return new ModelAndView("/global/subModelModaByBrandtl",new ExtendedModelMap().asMap());
    	//返回厂商页
    	else if("4".equals(map.get("subModelShowType"))) return new ModelAndView("/global/subModelModaByManftl",new ExtendedModelMap().asMap());
    	
    	return new ModelAndView("/global/subModelModal",new ExtendedModelMap().asMap());
        
    }
    
    /**
     * 通过返利成交价数据有效日期过滤查询生产商信息
     * @return
     * @throws Exception
     */
    @RequestMapping("/global/getManfModal")
    public ModelAndView getManfModal(HttpServletRequest request,HttpServletResponse response) throws Exception
    {
    	Map<String, Object> map = getPageParams(request);
    	globalManager.getManfModal(request,map);
    	return new ModelAndView("/global/manfModal",new ExtendedModelMap().asMap());
    }
    
    /**
     * 获取子车型下型号数据
     * @param request
     * @return
     * @throws Exception
     */
    @RequestMapping("/global/getVersionModalByCommon")
    public ModelAndView getVersionModalByCommon(HttpServletRequest request) throws Exception 
    {
    	Model model = new ExtendedModelMap();
    	globalManager.getVersionModalByCommon(request,getPageParams(request));
    	return new ModelAndView("/global/versionModal",model.asMap());
    }
    
    /**
     * 获取细分市场以及所属子细分市场
     * @param request
     * @return
     * @throws Exception
     */
    @RequestMapping("/global/getSegmentAndChildren")
    public ModelAndView getSegmentAndChildren(HttpServletRequest request) throws Exception 
    {
    	Model model = new ExtendedModelMap();
    	globalManager.getSegmentAndChildren(request, getGlobalParams(request));
    	return new ModelAndView("/global/segmentModal", model.asMap());
    }
    
    /**
     * 按首字母排序获取厂商
     * @param request
     * @return
     * @throws Exception
     */
    @RequestMapping("/global/getManf")
    public ModelAndView getManf(HttpServletRequest request) throws Exception 
    {
    	Model model = new ExtendedModelMap();
    	globalManager.getManf(request,getGlobalParams(request));
    	return new ModelAndView("/global/manfModal",model.asMap());
    }
    
    /**
     * 按首字母排序获取品牌
     * @param request
     * @return
     * @throws Exception
     */
    @RequestMapping("/global/getBrand")
    public ModelAndView getBrand(HttpServletRequest request) throws Exception 
    {
    	Model model = new ExtendedModelMap();
    	globalManager.getBrand(request,getGlobalParams(request));
    	return new ModelAndView("/global/brandModal",model.asMap());
    }
    
    /**
     * 获取车身形式
     * @param request
     * @return
     * @throws Exception
     */
    @RequestMapping("/global/getBodyType")
    public ModelAndView getBodyType(HttpServletRequest request) throws Exception 
    {
    	Model model = new ExtendedModelMap();
    	globalManager.getBodyType(request,getGlobalParams(request));
    	return new ModelAndView("/global/bodyTypeModal",model.asMap());
    }
    
	/**
     * 获取初始化常用对象
     * @return
     * @throws Exception
     */
    @RequestMapping("/global/getAutoCustomGroup")
    public ModelAndView getAutoCustomGroup(HttpServletRequest request,HttpServletResponse response) throws Exception
    {	
    	Map<String, Object> paraMap = getPageParams(request);
    	globalManager.getAutoCustomGroup(request,paraMap);
        return new ModelAndView("/global/autoVersionModal",new ExtendedModelMap().asMap());
    }
    
    /**
     * 校验成交价下有效车型和型号
     * @param request
     * @param response
     */
    @RequestMapping({"/checkPopBoxTpData"})
    public void checkPopBoxTpData(HttpServletRequest request, HttpServletResponse response)
    {
	      Map<String,Object> paramsMap = new HashMap<String,Object>();
	      paramsMap.put("beginDate", request.getParameter("beginDate"));
	      paramsMap.put("vid", request.getParameter("vid"));
	      //如果型号为空，则添加车型
	      if (AppFrameworkUtil.isEmpty((String)paramsMap.get("vid"))) paramsMap.put("mid", request.getParameter("mid"));
	
	      String json = globalManager.checkPopBoxTpData(request, paramsMap);
	      try {
	        print(response, json);
	      } catch (IOException e) {
	        e.printStackTrace();
	      }
    }
    
    /**
     * 获取弹出框公共参数
     * @param request
     * @return
     */
    public Map<String, Object> getGlobalParams(HttpServletRequest request)
    {
    	Map<String, Object> map = new HashMap<String, Object>();
    	map.put("userId", AppFrameworkUtil.getUserGroupId(request));//用户组ID
		map.put("beginDate", request.getParameter("beginDate"));//开始时间
		map.put("endDate", request.getParameter("endDate"));//结束时间
		map.put("analysisContentType",  request.getParameter("analysisContentType"));//当是4时价格降幅和区域价格降幅模块
		String segmentType = request.getParameter("segmentType");//细分市场类别
		if(null != segmentType) {
			segmentType = segmentType.replace(",", "','");
		}
		map.put("segmentType", segmentType);
		request.setAttribute("inputType", "1");//1：复选，2：单选;默认为1
    	return map;
    }
    
    /**
     * 获取页面参数
     * @param request
     * @return
     */
    public Map<String, Object> getPageParams(HttpServletRequest request)
	{
		Map<String, Object> map = new HashMap<String, Object>();
		
		map.put("userId", AppFrameworkUtil.getUserGroupId(request));//用户组ID
		map.put("beginDate", request.getParameter("beginDate"));//开始时间
		map.put("endDate", request.getParameter("endDate"));//结束时间
		map.put("modelIds",request.getParameter("modelIds"));//车型ID
		map.put("subModelShowType",request.getParameter("subModelShowType"));//子车型弹出框展示类型2：细分市场,3:品牌,4:厂商，为空则是本品与竟品
		map.put("bodyTypeId",request.getParameter("hatchbackId"));//价格降幅获取车型弹出框所对应的车身形式
		
		String analysisContentType = request.getParameter("analysisContentType");//分析数据指标类型1:利润；2：折扣:3：成交价
		if(AppFrameworkUtil.isEmpty(analysisContentType)) analysisContentType = "1";
		map.put("analysisContentType", analysisContentType);
		
		String timeType = request.getParameter("timeType");//时间类型1：时间点;2：时间段默认为2
		if(AppFrameworkUtil.isEmpty(timeType)) timeType = "2";
		map.put("timeType", timeType);
		
		String inputType = request.getParameter("inputType");//1：复选，2：单选;默认为1
    	if(inputType == null) inputType ="1";  
    	request.setAttribute("inputType",inputType);
    	
		return map;
	}
    
	/**
	 * 输出JSON流
	 * @param response
	 * @param result
	 * @throws IOException
	 */
	public void print(HttpServletResponse response, String result)throws IOException 
	{
		response.setCharacterEncoding("UTF-8");
		response.setContentType("text/json;charset=UTF-8");
		PrintWriter out = response.getWriter();
		out.print(result);
		out.flush();
		out.close();
	}
   
}