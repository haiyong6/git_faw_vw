package com.ways.app.policy.global.service;

import java.util.Map;
import javax.servlet.http.HttpServletRequest;

/**
 * 初始化控件
 * @author huangwenmei
 *
 */
public interface IPromotionGlobalManager {
	
	/**
	 * 获取初始化子车型弹出框控件值
	 * @param request
	 * @param paramsMap
	 */
	public void getSubmodelModal(HttpServletRequest request,Map<String, Object> paramsMap);
	
	/**
	 * 查询生产商信息
	 * @param request
	 * @param paramsMap
	 */
	public void getManfModal(HttpServletRequest request,Map<String, Object> paramsMap);
	
	/**
	 * 获取车型下的型号数据
	 * @param request
	 * @param paramsMap
	 */
	public void getVersionModalByCommon(HttpServletRequest request,Map<String, Object> paramsMap);	
	
	
	/**
	 * 获取细分市场以及所属子细分市场
	 * @param paramHttpServletRequest
	 * @param paramsMap
	 */
	public void getSegmentAndChildren(HttpServletRequest request, Map<String, Object> paramsMap);
	
	/**
	 * 按首字母获取厂商
	 * @param paramHttpServletRequest
	 * @param paramsMap
	 */
	public void getManf(HttpServletRequest request, Map<String, Object> paramsMap);
	
	/**
	 * 按首字母获取品牌
	 * @param paramHttpServletRequest
	 * @param paramsMap
	 */
	public void getBrand(HttpServletRequest request, Map<String, Object> paramsMap);
	
	/**
	 * 获取车身形式
	 * @param paramHttpServletRequest
	 * @param paramsMap
	 */
	public void getBodyType(HttpServletRequest request, Map<String, Object> paramsMap);
	
	
	/**
	* 函数功能说明 获取一汽大众常用型号组
	* May 11, 2015
	* 修改者名字 修改日期
	* 修改内容
	* @param request
	* @param paramsMap    
	* void   
	*/
	public void getAutoCustomGroup(HttpServletRequest request,Map<String, Object> paramsMap); 
	
	
	/**
	 * 获取车系
	 * @param paramHttpServletRequest
	 * @param paramsMap
	 */
	public void getOrig(HttpServletRequest request, Map<String, Object> paramsMap);
	
}