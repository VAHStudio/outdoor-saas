package com.touhuwai.controller;

import com.touhuwai.common.PageResult;
import com.touhuwai.common.Result;
import com.touhuwai.dto.param.PlanFrameBatchCreateDTO;
import com.touhuwai.entity.PlanFrame;
import com.touhuwai.service.PlanFrameService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * 方案框架明细管理控制器
 */
@RestController
@RequestMapping("/api/plan-frame")
@RequiredArgsConstructor
public class PlanFrameController {
    
    private final PlanFrameService planFrameService;
    
    /**
     * 根据ID查询方案框架明细
     * @param id 明细ID
     * @return 方案框架明细信息
     */
    @GetMapping("/{id}")
    public Result<PlanFrame> getById(@PathVariable Integer id) {
        PlanFrame planFrame = planFrameService.getById(id);
        if (planFrame == null) {
            return Result.notFound("明细信息不存在");
        }
        return Result.success(planFrame);
    }
    
    /**
     * 查询所有方案框架明细
     * @return 方案框架明细列表
     */
    @GetMapping("/list")
    public Result<List<PlanFrame>> getAll() {
        List<PlanFrame> list = planFrameService.getAll();
        return Result.success(list);
    }
    
    /**
     * 分页查询方案框架明细列表
     * @param planFrame 查询条件
     * @param pageNum 页码
     * @param pageSize 每页大小
     * @return 分页结果
     */
    @PostMapping("/page")
    public Result<PageResult<PlanFrame>> getPage(
            @RequestBody PlanFrame planFrame,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        PageResult<PlanFrame> pageResult = planFrameService.getPage(planFrame, pageNum, pageSize);
        return Result.success(pageResult);
    }
    
    /**
     * 根据方案ID查询明细列表
     * @param planId 方案ID
     * @return 方案框架明细列表
     */
    @GetMapping("/plan/{planId}")
    public Result<List<PlanFrame>> getByPlanId(@PathVariable Integer planId) {
        List<PlanFrame> list = planFrameService.getByPlanId(planId);
        return Result.success(list);
    }
    
    /**
     * 根据框架ID查询明细列表
     * @param frameId 框架ID
     * @return 方案框架明细列表
     */
    @GetMapping("/frame/{frameId}")
    public Result<List<PlanFrame>> getByFrameId(@PathVariable Integer frameId) {
        List<PlanFrame> list = planFrameService.getByFrameId(frameId);
        return Result.success(list);
    }
    
    /**
     * 根据方案社区ID查询明细列表
     * @param planCommunityId 方案社区ID
     * @return 方案框架明细列表
     */
    @GetMapping("/plan-community/{planCommunityId}")
    public Result<List<PlanFrame>> getByPlanCommunityId(@PathVariable Integer planCommunityId) {
        List<PlanFrame> list = planFrameService.getByPlanCommunityId(planCommunityId);
        return Result.success(list);
    }
    
    /**
     * 根据发布状态查询明细列表
     * @param releaseStatus 发布状态
     * @return 方案框架明细列表
     */
    @GetMapping("/status/{releaseStatus}")
    public Result<List<PlanFrame>> getByReleaseStatus(@PathVariable Integer releaseStatus) {
        List<PlanFrame> list = planFrameService.getByReleaseStatus(releaseStatus);
        return Result.success(list);
    }
    
    /**
     * 新增方案框架明细
     * @param planFrame 方案框架明细信息
     * @return 操作结果
     */
    @PostMapping
    public Result<Integer> add(@RequestBody PlanFrame planFrame) {
        if (planFrame.getPlanId() == null) {
            return Result.badRequest("方案ID不能为空");
        }
        if (planFrame.getFrameId() == null) {
            return Result.badRequest("框架ID不能为空");
        }
        if (planFrame.getPlanCommunityId() == null) {
            return Result.badRequest("方案社区ID不能为空");
        }
        int result = planFrameService.add(planFrame);
        if (result > 0) {
            return Result.success("新增成功", planFrame.getId());
        }
        return Result.error("新增失败");
    }
    
    /**
     * 批量新增方案框架明细
     * @param dto 批量创建参数
     * @return 操作结果
     */
    @PostMapping("/batch")
    public Result<Integer> batchAdd(@RequestBody PlanFrameBatchCreateDTO dto) {
        if (dto.getPlanId() == null) {
            return Result.badRequest("方案ID不能为空");
        }
        if (dto.getFrameIds() == null || dto.getFrameIds().isEmpty()) {
            return Result.badRequest("框架ID列表不能为空");
        }

        // 将DTO转换为实体列表
        List<PlanFrame> list = new ArrayList<>();
        for (Integer frameId : dto.getFrameIds()) {
            PlanFrame pf = new PlanFrame();
            pf.setPlanId(dto.getPlanId());
            pf.setFrameId(frameId);
            pf.setPlanCommunityId(dto.getPlanCommunityId());
            pf.setReleaseDateBegin(dto.getReleaseDateBegin());
            pf.setReleaseDateEnd(dto.getReleaseDateEnd());
            pf.setReleaseStatus(dto.getReleaseStatus());
            list.add(pf);
        }

        int result = planFrameService.batchAdd(list);
        if (result > 0) {
            return Result.success("批量新增成功", result);
        }
        return Result.error("批量新增失败");
    }
    
    /**
     * 更新方案框架明细
     * @param planFrame 方案框架明细信息
     * @return 操作结果
     */
    @PutMapping
    public Result<Integer> update(@RequestBody PlanFrame planFrame) {
        if (planFrame.getId() == null) {
            return Result.badRequest("明细ID不能为空");
        }
        int result = planFrameService.update(planFrame);
        if (result > 0) {
            return Result.success("更新成功", result);
        }
        return Result.error("更新失败");
    }
    
    /**
     * 根据ID删除方案框架明细
     * @param id 明细ID
     * @return 操作结果
     */
    @DeleteMapping("/{id}")
    public Result<Integer> delete(@PathVariable Integer id) {
        int result = planFrameService.delete(id);
        if (result > 0) {
            return Result.success("删除成功", result);
        }
        return Result.error("删除失败");
    }
    
    /**
     * 批量删除方案框架明细
     * @param ids ID列表
     * @return 操作结果
     */
    @DeleteMapping("/batch")
    public Result<Integer> batchDelete(@RequestParam List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            return Result.badRequest("ID列表不能为空");
        }
        int result = planFrameService.batchDelete(ids);
        if (result > 0) {
            return Result.success("批量删除成功", result);
        }
        return Result.error("批量删除失败");
    }
    
    /**
     * 根据查询参数分页查询方案框架明细列表
     * @param param 查询参数
     * @return 分页结果
     */
    @PostMapping("/filter/page")
    public Result<PageResult<PlanFrame>> getPageByParam(@RequestBody com.touhuwai.dto.param.PlanFrameQueryParam param) {
        PageResult<PlanFrame> pageResult = planFrameService.getPageByParam(param);
        return Result.success(pageResult);
    }
}
