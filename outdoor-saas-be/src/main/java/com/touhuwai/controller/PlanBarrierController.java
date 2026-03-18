package com.touhuwai.controller;

import com.touhuwai.common.PageResult;
import com.touhuwai.common.Result;
import com.touhuwai.dto.param.PlanBarrierBatchCreateDTO;
import com.touhuwai.entity.PlanBarrier;
import com.touhuwai.service.PlanBarrierService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * 方案道闸明细管理控制器
 */
@RestController
@RequestMapping("/api/plan-barrier")
@RequiredArgsConstructor
public class PlanBarrierController {
    
    private final PlanBarrierService planBarrierService;
    
    /**
     * 根据ID查询方案道闸明细
     * @param id 明细ID
     * @return 方案道闸明细信息
     */
    @GetMapping("/{id}")
    public Result<PlanBarrier> getById(@PathVariable Integer id) {
        PlanBarrier planBarrier = planBarrierService.getById(id);
        if (planBarrier == null) {
            return Result.notFound("明细信息不存在");
        }
        return Result.success(planBarrier);
    }
    
    /**
     * 查询所有方案道闸明细
     * @return 方案道闸明细列表
     */
    @GetMapping("/list")
    public Result<List<PlanBarrier>> getAll() {
        List<PlanBarrier> list = planBarrierService.getAll();
        return Result.success(list);
    }
    
    /**
     * 分页查询方案道闸明细列表
     * @param planBarrier 查询条件
     * @param pageNum 页码
     * @param pageSize 每页大小
     * @return 分页结果
     */
    @PostMapping("/page")
    public Result<PageResult<PlanBarrier>> getPage(
            @RequestBody PlanBarrier planBarrier,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        PageResult<PlanBarrier> pageResult = planBarrierService.getPage(planBarrier, pageNum, pageSize);
        return Result.success(pageResult);
    }
    
    /**
     * 根据方案ID查询明细列表
     * @param planId 方案ID
     * @return 方案道闸明细列表
     */
    @GetMapping("/plan/{planId}")
    public Result<List<PlanBarrier>> getByPlanId(@PathVariable Integer planId) {
        List<PlanBarrier> list = planBarrierService.getByPlanId(planId);
        return Result.success(list);
    }
    
    /**
     * 根据道闸ID查询明细列表
     * @param barrierGateId 道闸ID
     * @return 方案道闸明细列表
     */
    @GetMapping("/barrier/{barrierGateId}")
    public Result<List<PlanBarrier>> getByBarrierGateId(@PathVariable Integer barrierGateId) {
        List<PlanBarrier> list = planBarrierService.getByBarrierGateId(barrierGateId);
        return Result.success(list);
    }
    
    /**
     * 根据方案社区ID查询明细列表
     * @param planCommunityId 方案社区ID
     * @return 方案道闸明细列表
     */
    @GetMapping("/plan-community/{planCommunityId}")
    public Result<List<PlanBarrier>> getByPlanCommunityId(@PathVariable Integer planCommunityId) {
        List<PlanBarrier> list = planBarrierService.getByPlanCommunityId(planCommunityId);
        return Result.success(list);
    }
    
    /**
     * 根据发布状态查询明细列表
     * @param releaseStatus 发布状态
     * @return 方案道闸明细列表
     */
    @GetMapping("/status/{releaseStatus}")
    public Result<List<PlanBarrier>> getByReleaseStatus(@PathVariable Integer releaseStatus) {
        List<PlanBarrier> list = planBarrierService.getByReleaseStatus(releaseStatus);
        return Result.success(list);
    }
    
    /**
     * 新增方案道闸明细
     * @param planBarrier 方案道闸明细信息
     * @return 操作结果
     */
    @PostMapping
    public Result<Integer> add(@RequestBody PlanBarrier planBarrier) {
        if (planBarrier.getPlanId() == null) {
            return Result.badRequest("方案ID不能为空");
        }
        if (planBarrier.getBarrierGateId() == null) {
            return Result.badRequest("道闸ID不能为空");
        }
        if (planBarrier.getPlanCommunityId() == null) {
            return Result.badRequest("方案社区ID不能为空");
        }
        int result = planBarrierService.add(planBarrier);
        if (result > 0) {
            return Result.success("新增成功", planBarrier.getId());
        }
        return Result.error("新增失败");
    }
    
    /**
     * 批量新增方案道闸明细
     * @param dto 批量创建参数
     * @return 操作结果
     */
    @PostMapping("/batch")
    public Result<Integer> batchAdd(@RequestBody PlanBarrierBatchCreateDTO dto) {
        if (dto.getPlanId() == null) {
            return Result.badRequest("方案ID不能为空");
        }
        if (dto.getBarrierGateIds() == null || dto.getBarrierGateIds().isEmpty()) {
            return Result.badRequest("道闸ID列表不能为空");
        }

        // 将DTO转换为实体列表
        List<PlanBarrier> list = new ArrayList<>();
        for (Integer barrierGateId : dto.getBarrierGateIds()) {
            PlanBarrier pb = new PlanBarrier();
            pb.setPlanId(dto.getPlanId());
            pb.setBarrierGateId(barrierGateId);
            pb.setPlanCommunityId(dto.getPlanCommunityId());
            pb.setReleaseDateBegin(dto.getReleaseDateBegin());
            pb.setReleaseDateEnd(dto.getReleaseDateEnd());
            pb.setReleaseStatus(dto.getReleaseStatus());
            list.add(pb);
        }

        int result = planBarrierService.batchAdd(list);
        if (result > 0) {
            return Result.success("批量新增成功", result);
        }
        return Result.error("批量新增失败");
    }
    
    /**
     * 更新方案道闸明细
     * @param planBarrier 方案道闸明细信息
     * @return 操作结果
     */
    @PutMapping
    public Result<Integer> update(@RequestBody PlanBarrier planBarrier) {
        if (planBarrier.getId() == null) {
            return Result.badRequest("明细ID不能为空");
        }
        int result = planBarrierService.update(planBarrier);
        if (result > 0) {
            return Result.success("更新成功", result);
        }
        return Result.error("更新失败");
    }
    
    /**
     * 根据ID删除方案道闸明细
     * @param id 明细ID
     * @return 操作结果
     */
    @DeleteMapping("/{id}")
    public Result<Integer> delete(@PathVariable Integer id) {
        int result = planBarrierService.delete(id);
        if (result > 0) {
            return Result.success("删除成功", result);
        }
        return Result.error("删除失败");
    }
    
    /**
     * 批量删除方案道闸明细
     * @param ids ID列表
     * @return 操作结果
     */
    @DeleteMapping("/batch")
    public Result<Integer> batchDelete(@RequestParam List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            return Result.badRequest("ID列表不能为空");
        }
        int result = planBarrierService.batchDelete(ids);
        if (result > 0) {
            return Result.success("批量删除成功", result);
        }
        return Result.error("批量删除失败");
    }
    
    /**
     * 根据查询参数分页查询方案道闸明细列表
     * @param param 查询参数
     * @return 分页结果
     */
    @PostMapping("/filter/page")
    public Result<PageResult<PlanBarrier>> getPageByParam(@RequestBody com.touhuwai.dto.param.PlanBarrierQueryParam param) {
        PageResult<PlanBarrier> pageResult = planBarrierService.getPageByParam(param);
        return Result.success(pageResult);
    }
}
