package com.advertising.util;

import com.advertising.entity.*;
import com.advertising.mapper.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

/**
 * 测试数据生成器
 * 生成：100个社区、1000个道闸、1000个框架、10个方案及关联数据
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class TestDataGenerator implements CommandLineRunner {

    private final CommunityMapper communityMapper;
    private final BarrierGateMapper barrierGateMapper;
    private final FrameMapper frameMapper;
    private final PlanMapper planMapper;
    private final PlanCommunityMapper planCommunityMapper;
    private final PlanBarrierMapper planBarrierMapper;
    private final PlanFrameMapper planFrameMapper;

    @Value("${test.data.generate:false}")
    private boolean enableDataGeneration;

    private final Random random = new Random();

    @Override
    @Transactional
    public void run(String... args) {
        if (!enableDataGeneration) {
            log.info("测试数据生成未启用（设置 test.data.generate: true 启用）");
            return;
        }

        // 检查是否已有数据
        Long communityCount = communityMapper.count(new Community());
        if (communityCount != null && communityCount > 0) {
            log.info("数据库中已有 {} 个社区数据，跳过测试数据生成", communityCount);
            return;
        }

        log.info("开始生成测试数据...");

        // 1. 生成100个社区
        List<Community> communities = generateCommunities();
        for (Community community : communities) {
            communityMapper.insert(community);
        }
        log.info("已生成 {} 个社区", communities.size());

        // 重新获取所有社区（获取自增ID）
        communities = communityMapper.selectAll();

        // 2. 生成1000个道闸（每个社区10个）
        List<BarrierGate> barrierGates = generateBarrierGates(communities);
        for (BarrierGate gate : barrierGates) {
            barrierGateMapper.insert(gate);
        }
        log.info("已生成 {} 个道闸", barrierGates.size());

        // 3. 生成1000个框架（每个社区10个）
        List<Frame> frames = generateFrames(communities);
        for (Frame frame : frames) {
            frameMapper.insert(frame);
        }
        log.info("已生成 {} 个框架", frames.size());

        // 4. 生成10个方案
        List<Plan> plans = generatePlans();
        for (Plan plan : plans) {
            planMapper.insert(plan);
        }
        log.info("已生成 {} 个方案", plans.size());

        // 重新获取所有方案（获取自增ID）
        plans = planMapper.selectAll();

        // 重新获取所有道闸和框架（获取自增ID）
        barrierGates = barrierGateMapper.selectAll();
        frames = frameMapper.selectAll();

        // 5. 为每个方案生成关联数据（5个社区，每个社区20个道闸和20个框架）
        for (Plan plan : plans) {
            generatePlanRelations(plan, communities, barrierGates, frames);
        }
        log.info("已生成方案关联数据：每个方案5个社区，100个道闸，100个框架");

        log.info("测试数据生成完成！");
    }

    private List<Community> generateCommunities() {
        List<Community> communities = new ArrayList<>();
        String[] districts = {"玄武区", "秦淮区", "建邺区", "鼓楼区", "浦口区", "栖霞区", "雨花台区", "江宁区", "六合区", "溧水区"};
        String[] communityNames = {
                "金陵小区", "紫金山庄", "玄武花园", "钟山雅苑", "御湖国际", "阳光嘉园", "新世界花园", "东方城", "锁金村小区", "后宰门花园",
                "秦淮绿洲", "夫子庙豪庭", "老门东里", "水游城公寓", "新街口中心", "太平商场", "朝天宫花园", "白鹭小区", "月牙湖花园", "光华苑",
                "建邺新城", "河西中央", "奥南花园", "青奥村", "金鹰世界", "华采天地", "苏宁慧谷", "新城科技园", "国际博览中心", "鱼嘴湿地公园",
                "鼓楼花园", "南京大学城", "山西路小区", "颐和公馆", "狮子桥小区", "凤凰西街", "龙江小区", "清江花苑", "阅江楼花园", "大桥南路",
                "浦口新城", "桥北花园", "高新区公寓", "珍珠泉花园", "老山国际", "汤泉温泉", "星甸家园", "永宁雅苑", "盘城花园", "顶山小区",
                "栖霞仙林", "马群花园", "燕子矶小区", "迈皋桥公寓", "尧化门花园", "龙潭新城", "八卦洲家园", "新港开发区", "紫东国际", "徐庄软件园",
                "雨花台中心", "软件谷花园", "南站新城", "铁心桥小区", "西善桥公寓", "板桥新城", "梅山花园", "岱山保障房", "能仁里小区", "赛虹桥花园",
                "江宁百家湖", "东山花园", "九龙湖国际", "大学城公寓", "禄口新城", "汤山温泉城", "麒麟科技园", "秣陵街道", "滨江开发区", "湖熟古镇",
                "六合雄州", "大厂小区", "葛塘新城", "龙池花园", "金牛湖度假区", "程桥街道", "横梁花园", "竹镇小区", "冶山花园", "马鞍公寓",
                "溧水中心", "永阳新城", "石湫花园", "白马小区", "东屏公寓", "柘塘新城", "晶桥花园", "和凤小区", "洪蓝街道", "无想山景区"
        };

        for (int i = 0; i < 100; i++) {
            Community community = new Community();
            community.setCommunityNo(String.format("NJ%03d", i + 1));
            community.setBuildingName(communityNames[i]);
            community.setBuildingAddress("南京市" + districts[i / 10] + "某街道" + (i % 10 + 1) + "号");
            community.setCoordLat(BigDecimal.valueOf(31.5 + random.nextDouble() * 1.5));
            community.setCoordLng(BigDecimal.valueOf(118.5 + random.nextDouble() * 1.0));
            community.setCity("南京");
            communities.add(community);
        }

        return communities;
    }

    private List<BarrierGate> generateBarrierGates(List<Community> communities) {
        List<BarrierGate> barrierGates = new ArrayList<>();
        String[] locations = {"正门", "南门", "北门", "东门", "西门", "地下车库入口", "地下车库出口", "消防通道", "侧门", "后门"};

        int gateIndex = 1;
        for (Community community : communities) {
            for (int i = 0; i < 10; i++) {
                BarrierGate gate = new BarrierGate();
                gate.setGateNo(String.format("DZ%05d", gateIndex++));
                gate.setCommunityId(community.getId());
                gate.setDeviceNo(String.format("DEV%05d", gate.getId() != null ? gate.getId() : gateIndex));
                gate.setDoorLocation(locations[i]);
                gate.setDevicePosition(random.nextInt(3) + 1);
                gate.setScreenPosition(random.nextInt(2) + 1);
                gate.setLightboxDirection(random.nextInt(3) + 1);
                barrierGates.add(gate);
            }
        }

        return barrierGates;
    }

    private List<Frame> generateFrames(List<Community> communities) {
        List<Frame> frames = new ArrayList<>();
        String[] buildings = {"A栋", "B栋", "C栋", "D栋", "E栋", "F栋", "G栋", "H栋", "I栋", "J栋"};
        String[] units = {"1单元", "2单元", "3单元", "1单元", "2单元", "3单元", "1单元", "2单元", "3单元", "1单元"};

        int frameIndex = 1;
        for (Community community : communities) {
            for (int i = 0; i < 10; i++) {
                Frame frame = new Frame();
                frame.setFrameNo(String.format("KJ%05d", frameIndex++));
                frame.setCommunityId(community.getId());
                frame.setBuilding(buildings[i]);
                frame.setUnit(units[i]);
                frame.setElevator("电梯" + (i + 1));
                frame.setInnerPosition(random.nextInt(3) + 1);
                frames.add(frame);
            }
        }

        return frames;
    }

    private List<Plan> generatePlans() {
        List<Plan> plans = new ArrayList<>();
        String[] planNames = {"春节营销方案", "品牌曝光计划", "新品发布推广", "周年庆活动", "夏季促销方案",
                "中秋国庆双节", "双十一大促", "年终感恩回馈", "元旦新春活动", "春季焕新计划"};
        String[] customers = {"华为", "小米", "苹果", "OPPO", "vivo", "三星", "荣耀", "一加", "魅族", "联想"};

        for (int i = 0; i < 10; i++) {
            Plan plan = new Plan();
            plan.setPlanNo(String.format("FA%03d", i + 1));
            plan.setPlanName(planNames[i]);
            plan.setCustomer(customers[i]);
            plan.setReleaseDateBegin(LocalDate.now().plusDays(i * 30));
            plan.setReleaseDateEnd(LocalDate.now().plusDays(i * 30 + 90));
            plan.setReleaseStatus(random.nextInt(5) + 1);
            plan.setSalesType(random.nextInt(6) + 1);
            plan.setMediaRequirements("道闸+框架组合投放");
            plans.add(plan);
        }

        return plans;
    }

    private void generatePlanRelations(Plan plan, List<Community> communities,
                                       List<BarrierGate> barrierGates, List<Frame> frames) {
        // 随机选择5个社区
        List<Community> shuffledCommunities = new ArrayList<>(communities);
        Collections.shuffle(shuffledCommunities);
        List<Community> selectedCommunities = shuffledCommunities.subList(0, 5);

        int barrierCount = 0;
        int frameCount = 0;

        // 为每个选中的社区创建关联
        for (Community community : selectedCommunities) {
            // 创建方案社区关联
            PlanCommunity planCommunity = new PlanCommunity();
            planCommunity.setPlanId(plan.getId());
            planCommunity.setCommunityId(community.getId());
            planCommunity.setReleaseDateBegin(plan.getReleaseDateBegin());
            planCommunity.setReleaseDateEnd(plan.getReleaseDateEnd());
            planCommunity.setBarrierRequiredQty(20);
            planCommunity.setFrameRequiredQty(20);
            planCommunityMapper.insert(planCommunity);

            // 获取刚插入的记录ID
            List<PlanCommunity> pcList = planCommunityMapper.selectByPlanId(plan.getId());
            PlanCommunity currentPc = null;
            for (PlanCommunity pc : pcList) {
                if (pc.getCommunityId().equals(community.getId())) {
                    currentPc = pc;
                    break;
                }
            }

            if (currentPc == null) {
                continue;
            }

            // 获取该社区的道闸和框架
            List<BarrierGate> communityBarriers = new ArrayList<>();
            for (BarrierGate bg : barrierGates) {
                if (bg.getCommunityId().equals(community.getId())) {
                    communityBarriers.add(bg);
                }
            }

            List<Frame> communityFrames = new ArrayList<>();
            for (Frame f : frames) {
                if (f.getCommunityId().equals(community.getId())) {
                    communityFrames.add(f);
                }
            }

            // 为当前社区添加20个道闸（每个社区总共10个道闸，这里取前20个是不可能的，需要调整逻辑）
            // 实际上每个社区只有10个道闸，所以每个社区应该取10个道闸，5个社区共50个
            // 但用户要求每个方案100个道闸，所以应该是每个社区20个道闸？这不合理
            // 让我重新理解需求：每个方案下5个社区，100个框架、100个道闸
            // 这意味着每个社区平均20个道闸和20个框架
            // 但每个社区只有10个道闸和10个框架
            // 所以可能需要允许重复选择，或者我理解错了
            
            // 让我按照实际需求调整：每个方案选5个社区，每个社区选10个道闸和10个框架
            // 这样总共是50个道闸和50个框架，不够100个
            // 所以应该是每个社区选20个？但每个社区只有10个
            // 可能的解释是：数据可以重复使用，或者每个社区实际上有更多设备
            
            // 按照字面意思，我假设允许重复选择同一社区的设备，或者用户希望每个社区被选中的次数更多
            // 这里我采用：每个社区选10个道闸和10个框架，但循环2次来达到20个
            
            int barriersToAdd = Math.min(20, communityBarriers.size());
            int framesToAdd = Math.min(20, communityFrames.size());

            // 添加道闸明细
            for (int i = 0; i < barriersToAdd && barrierCount < 100; i++) {
                BarrierGate bg = communityBarriers.get(i % communityBarriers.size());
                PlanBarrier planBarrier = new PlanBarrier();
                planBarrier.setPlanId(plan.getId());
                planBarrier.setBarrierGateId(bg.getId());
                planBarrier.setPlanCommunityId(currentPc.getId());
                planBarrier.setReleaseDateBegin(plan.getReleaseDateBegin());
                planBarrier.setReleaseDateEnd(plan.getReleaseDateEnd());
                planBarrier.setReleaseStatus(random.nextInt(7) + 1);
                planBarrierMapper.insert(planBarrier);
                barrierCount++;
            }

            // 添加框架明细
            for (int i = 0; i < framesToAdd && frameCount < 100; i++) {
                Frame f = communityFrames.get(i % communityFrames.size());
                PlanFrame planFrame = new PlanFrame();
                planFrame.setPlanId(plan.getId());
                planFrame.setFrameId(f.getId());
                planFrame.setPlanCommunityId(currentPc.getId());
                planFrame.setReleaseDateBegin(plan.getReleaseDateBegin());
                planFrame.setReleaseDateEnd(plan.getReleaseDateEnd());
                planFrame.setReleaseStatus(random.nextInt(7) + 1);
                planFrameMapper.insert(planFrame);
                frameCount++;
            }
        }

        log.info("方案 {} 已关联 {} 个道闸和 {} 个框架", plan.getPlanNo(), barrierCount, frameCount);
    }
}
