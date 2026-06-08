const projects = [
  {
    id: "tennis",
    index: "01",
    title: "AI-Based Tennis Stroke Semantic Analysis",
    direction: "AI 视频理解 / 运动智能分析 / 网球击球语义分析",
    cover: "assets/case-tennis.png",
    summary: "从网球转播视频中自动识别何时发生击球、由谁击球、击球类型是什么、球被打向哪里，并输出可解释的击球级语义记录。",
    tags: ["VideoMAE", "PyTorch", "OpenCV", "YOLO", "Random Forest", "Event-Centric Workflow"],
    stats: [
      ["Event F1", "88.89%"],
      ["FH/BH Accuracy", "95.45%"],
      ["CC/DTL Accuracy", "88.64%"],
      ["VideoMAE Lift", "+21.60 pp"],
      ["RF Direction Lift", "+21.97 pp"]
    ],
    workflow: ["Baseline Tracking", "Event Detection", "Evidence Export", "VideoMAE FH/BH", "RF Direction", "Semantic Records"],
    sections: [
      {
        key: "overview",
        tab: "Overview",
        title: "项目概览",
        paragraphs: [
          "本项目面向网球转播视频中的击球语义理解任务，目标是从普通比赛视频中自动识别“何时发生击球、由谁击球、击球类型是什么、球被打向哪里”。项目构建了以击球事件为中心的语义分析流程，将逐帧检测跟踪结果转化为可解释、可训练、可复查的击球级语义记录。",
          "系统输出的每条击球记录包含击球帧、击球球员、击球类型、击球方向、置信度以及对应视觉证据，可用于比赛复盘、球员技术分析和战术统计扩展。"
        ],
        ordered: [
          "击球类型识别：识别 Forehand / Backhand。",
          "击球方向分析：识别 Cross-court / Down-the-line。"
        ]
      },
      {
        key: "problem",
        tab: "Problem",
        title: "项目背景与问题",
        paragraphs: [
          "网球视频分析首先需要完成 player detection、ball tracking、court keypoint detection 和轨迹可视化。但这些逐帧 tracking results 本质上只是 frame-level measurements，只能说明球员、网球和球场关键点的位置，不能直接回答击球语义问题。",
          "因此，项目核心是建立一个 event-centric bridge，把 player / ball / court tracking outputs 转化为 stroke-level semantic records，使低层视觉结果能够支撑后续击球类型和击球方向识别。"
        ],
        bullets: [
          "什么时候真正发生了一次击球？",
          "当前击球由哪名球员完成？",
          "当前击球是正手还是反手？",
          "击球后球路是斜线还是直线？",
          "每次判断是否有足够视觉证据支撑？"
        ]
      },
      {
        key: "contribution",
        tab: "Contribution",
        title: "我的主要工作与贡献边界",
        paragraphs: [
          "本项目以已有网球分析 baseline 为基础，复现并适配球员检测、网球检测、球场关键点检测和基础跟踪模块。这些低层感知模块主要作为输入基础，不作为本项目原创贡献。",
          "我的主要工作集中在 baseline 之后的语义分析层。"
        ],
        bullets: [
          "设计击球事件检测逻辑，从连续轨迹中定位 `hit_frame` 和 `hitter_id`。",
          "构建事件级数据导出流程，生成击球片段、局部图像区域和击球后轨迹证据。",
          "训练基于 **VideoMAE-base** 的击球类型识别模型。",
          "设计基于轨迹几何特征的 **Random Forest** 击球方向分类器。",
          "建立事件检测、击球类型识别、击球方向分析三层评估体系。",
          "对 tracking noise、court calibration error、样本不均衡等问题进行误差诊断。"
        ]
      },
      {
        key: "workflow",
        tab: "Workflow",
        title: "系统流程",
        paragraphs: [
          "系统首先读取网球转播视频，通过 baseline perception modules 获得逐帧球员框、网球位置、球场关键点和坐标映射结果。随后，这些检测跟踪结果被整理为 `video__tracks.csv` 格式的逐帧 tracking table，作为后续语义分析的统一输入。",
          "在此基础上，系统设计规则驱动的击球事件检测模块。该模块结合球员与网球的距离变化、球速变化、球路方向变化、反弹抑制和时间窗口去重，从连续轨迹中提取击球事件锚点。每个击球事件由 `hit_frame + hitter_id` 表示。",
          "围绕击球事件锚点，系统进一步生成三类事件级证据，这些证据共同构成击球类型识别和击球方向分析的输入，使系统从逐帧检测结果转化为击球事件样本。"
        ],
        bullets: [
          "以击球时刻为中心的视频片段。",
          "击球球员和网球的局部图像区域。",
          "击球后球路轨迹及其球场归一化坐标。"
        ]
      },
      {
        key: "models",
        tab: "Models",
        title: "击球类型识别与方向分析",
        paragraphs: [
          "击球类型识别分支基于 **Kinetics-pretrained VideoMAE-base** 构建，用于完成 Forehand / Backhand 二分类。系统以击球球员为中心截取 16-frame 视频片段，并替换原始分类头，使模型适配当前 FH/BH 识别任务。",
          "训练过程中使用小规模人工标注数据进行任务微调，并采用较保守的 backbone 更新策略，避免在样本规模有限的情况下破坏预训练模型已有的视频时空表示。该分支最终在当前人工标注测试集上达到 **95.45% accuracy**，相比初始 VideoMAE baseline 提升 **21.60 pp**。",
          "击球方向分析分支将 Cross-court / Down-the-line 判断重构为事件级轨迹几何分类任务。方向判断强依赖击球后的球路方向、落点趋势以及球场中线关系，因此系统重点提取击球后的轨迹特征，而不是只依赖单帧图像。",
          "系统为每个击球事件提取击球后的球路轨迹，并结合球场归一化坐标构建结构化特征。特征空间包含事件置信度、击球后轨迹方向、轨迹位移、球场中线关系、轨迹完整性和质量诊断等信息，共形成 67 维数值特征。随后使用 **800-tree Random Forest** 完成 CC/DTL 方向分类。该分支最终在当前人工标注事件集上达到 **88.64% accuracy**。"
        ]
      },
      {
        key: "highlights",
        tab: "Highlights",
        title: "关键技术亮点",
        bullets: [
          "**事件级语义桥接**：将逐帧 player / ball / court tracking results 转换为击球帧、击球球员、事件片段、局部图像区域和击球后球路轨迹，解决低层检测结果无法直接支撑击球语义建模的问题。",
          "**小样本视频动作识别**：基于 VideoMAE-base 构建 FH/BH 击球类型识别分支，通过事件中心化视频片段和任务微调提升小样本场景下的动作识别效果。",
          "**轨迹几何方向建模**：将击球方向分析转化为轨迹与球场几何分类任务，结合击球后球路、中线关系、轨迹完整性和质量诊断指标完成 CC/DTL 判断。",
          "**可解释语义记录输出**：系统不仅输出分类结果，还保留每次判断对应的 hit frame、hitter、trajectory evidence 和 confidence，便于人工复查与错误分析。",
          "**完整误差诊断体系**：对 tracking noise、court calibration sensitivity、DTL 样本不均衡和非底线击球干扰进行分析，为后续扩展更多击球类别和更大规模数据提供基础。"
        ]
      },
      {
        key: "tech",
        tab: "Tech",
        title: "技术栈",
        paragraphs: ["Python, PyTorch, HuggingFace Transformers, VideoMAE, OpenCV, YOLO, ResNet50, scikit-learn, Random Forest, pandas, NumPy"]
      },
      {
        key: "results",
        tab: "Results",
        title: "项目结果",
        paragraphs: [
          "本项目最终实现了一套从网球转播视频到击球事件语义记录的完整分析系统。该项目验证了在 broadcast tennis videos 中构建 event-level semantic workflow 的可行性，也为后续扩展到更多击球类型、半自动标注数据集构建、球员战术习惯分析和下一拍方向预测提供了基础。"
        ],
        bullets: [
          "击球事件检测 F1 score：**88.89%**。",
          "FH/BH 击球类型识别 accuracy：**95.45%**。",
          "CC/DTL 击球方向分析 accuracy：**88.64%**。",
          "VideoMAE 分支相比初始 baseline 提升：**21.60 pp**。",
          "Random Forest 方向分支相比 YOLO shot-level baseline 提升：**21.97 pp**。"
        ]
      }
    ]
  },
  {
    id: "agriculture",
    index: "02",
    title: "Agricultural Intelligent Hazard Recognition",
    direction: "AI 图像识别 / 智慧农业 / 番茄叶病害检测",
    cover: "assets/case-agriculture.png",
    summary: "构建从原始农业图像到可验证识别模型的完整实验流程，重点处理光照变化、背景复杂、叶片遮挡和标注质量不稳定等问题。",
    tags: ["YOLO", "ResNet", "OpenCV", "GIoU", "Attention", "Data Augmentation"],
    stats: [["Accuracy", "88%+"], ["Baseline", "~70%"], ["Role", "Team Lead"], ["Loop", "QA + Error Analysis"]],
    workflow: ["Data Audit", "Label QA", "Augmentation", "YOLO / ResNet", "Optimization", "Error Loop"],
    sections: [
      {
        key: "overview",
        tab: "Overview",
        title: "项目概览",
        paragraphs: [
          "本项目面向番茄叶病害识别场景，目标是构建一套从原始农业图像到可验证识别模型的完整实验流程。项目围绕番茄叶片图像中的病害区域识别展开，重点处理真实图像中光照变化、背景复杂、叶片遮挡、病害纹理细微以及标注质量不稳定等问题。",
          "项目输出包括清洗后的训练数据、数据增强方案、模型对比结果、优化记录、错误样例分析和最终项目报告。"
        ],
        ordered: [
          "数据清洗与标注质量控制：筛除低质量图像，修正错误标注，构建可用于训练的病害识别数据集。",
          "模型训练与结构对比：围绕 YOLO 与 ResNet 方案开展检测和特征提取实验。",
          "模型优化与结果验证：通过数据增强、损失函数调整、注意力机制和训练策略优化提升模型稳定性。"
        ]
      },
      {
        key: "problem",
        tab: "Problem",
        title: "项目背景与问题",
        paragraphs: [
          "番茄叶病害识别的难点主要来自数据本身。原始图像中存在大量拍摄质量不一致的样本，例如叶片模糊、病害区域过小、背景干扰明显、光照过暗或过曝、标注框偏移等问题。这些问题会直接影响模型训练，使模型学习到背景噪声或错误区域，而不是病害特征本身。",
          "因此，项目首先需要建立数据质量控制流程。只有图像质量、标注质量和类别分布相对稳定，后续模型结构优化才有意义。"
        ]
      },
      {
        key: "contribution",
        tab: "Contribution",
        title: "我的主要工作与贡献边界",
        paragraphs: [
          "我在项目中担任团队负责人，主要负责数据处理流程、实验路线设计、模型优化推进和结果汇总。",
          "在数据清洗阶段，我设计并实现了一套半自动化数据筛选流程。流程首先通过脚本对图像进行初筛，根据图像尺寸、亮度、模糊程度、文件完整性和标注文件匹配情况筛除明显低质量样本；随后进行人工 QA，重点检查病害区域是否清晰、标注框是否覆盖目标、类别标签是否正确。",
          "在数据增强阶段，我围绕真实农业图像的变化特点设计增强策略，包括亮度扰动、颜色变化、旋转、缩放、翻转和背景干扰模拟，使模型能够适应不同拍摄条件下的叶片图像。"
        ]
      },
      {
        key: "workflow",
        tab: "Workflow",
        title: "系统流程",
        paragraphs: [
          "系统首先读取原始番茄叶图像和标注文件，并通过自动化脚本完成初步筛选。脚本会检查图像是否损坏、分辨率是否过低、亮度是否异常、图像是否严重模糊，以及标注文件是否缺失或与图像不匹配。",
          "完成自动筛选后，团队对保留样本进行人工 QA，重点检查标注框、类别标签和病害区域清晰度。经过这一步后，数据集被重新整理为训练集、验证集和测试集。",
          "模型训练阶段分为 baseline 建立和优化实验两部分。项目首先使用基础 YOLO / ResNet 方案建立初始结果，再逐步加入数据增强、注意力模块、GIoU 损失和训练参数调整。每一轮实验都会记录准确率变化、误检样例和漏检样例，用于判断优化是否真正提升了模型对病害区域的识别能力。"
        ]
      },
      {
        key: "highlights",
        tab: "Highlights",
        title: "关键技术亮点",
        bullets: [
          "**半自动化数据清洗与标注 QA 流程**：数据初筛脚本对原始图像进行自动化检查，先输出可疑样本清单，再由人工进行二次 QA，提高数据清洗效率，也减少错误标注对模型训练的干扰。",
          "**面向田间图像的数据增强策略**：针对光照变化、拍摄角度差异、叶片旋转、尺度变化和背景干扰设计增强方式，并保持标注框与图像变换同步。",
          "**YOLO 与 ResNet 双路线模型实验**：同时验证目标检测路线和特征分类路线，判断任务更依赖目标区域定位还是全局图像特征表达。",
          "**模型结构与训练策略多轮优化**：围绕注意力机制、GIoU 损失、学习率、batch size、epoch 数、输入尺寸和增强组合进行多轮实验。",
          "**错误样例驱动的实验闭环**：误检样本分析背景噪声与叶片纹理干扰，漏检样本分析病害区域过小、颜色不明显或标注偏差，并反向用于数据清洗和模型优化。"
        ]
      },
      {
        key: "tech",
        tab: "Tech",
        title: "技术栈",
        paragraphs: ["Python, PyTorch, YOLO, ResNet, OpenCV, Attention Mechanism, GIoU, Data Cleaning, Data Augmentation, Model Evaluation"]
      },
      {
        key: "results",
        tab: "Results",
        title: "项目结果",
        paragraphs: [
          "通过数据清洗、增强策略和多轮模型优化，项目将病害检测准确率由约 **70%** 提升至 **88%+**。项目最终形成从数据质量控制、模型训练、结构对比、参数调优到错误分析的完整实验闭环。",
          "该项目体现了农业图像识别任务中数据质量、标注 QA、增强策略和错误分析对模型稳定性的关键影响。"
        ]
      }
    ]
  },
  {
    id: "hep2",
    index: "03",
    title: "HEp-2 Cell Image Classification",
    direction: "医学图像分析 / 迁移学习 / HEp-2 细胞图像分类",
    cover: "assets/case-hep2.png",
    summary: "基于迁移学习识别不同 HEp-2 细胞荧光模式，比较 AlexNet 与 ResNet 在医学图像任务中的适配效果。",
    tags: ["PyTorch", "AlexNet", "ResNet", "Transfer Learning", "Fine-tuning"],
    stats: [["Task", "Classification"], ["Models", "AlexNet / ResNet"], ["Method", "Fine-tuning"], ["Focus", "Class-level Error"]],
    workflow: ["Preprocess", "Split Data", "Replace Head", "Freeze / Fine-tune", "Evaluate", "Error Analysis"],
    sections: [
      {
        key: "overview",
        tab: "Overview",
        title: "项目概览",
        paragraphs: [
          "本项目面向 HEp-2 免疫荧光细胞图像分类任务，目标是利用迁移学习方法识别不同细胞荧光模式。项目重点在于构建稳定的医学图像分类实验流程，并分析不同预训练模型在细胞图像任务中的适配效果。"
        ],
        ordered: [
          "医学图像预处理：统一图像尺寸、归一化输入，并处理类别分布和样本质量问题。",
          "迁移学习建模：基于 AlexNet 和 ResNet 构建细胞图像分类模型。",
          "模型表现分析：从类别混淆、特征表达和模型泛化角度分析不同方案的表现差异。"
        ]
      },
      {
        key: "problem",
        tab: "Problem",
        title: "项目背景与问题",
        paragraphs: [
          "HEp-2 细胞图像具有明显的医学图像特征：部分类别之间纹理和荧光模式相似，同一类别内部又会受到亮度、形态和细胞边界变化影响。如果直接从零训练模型，容易受到样本规模和类别差异限制。",
          "因此，本项目采用迁移学习路线，利用预训练 CNN 模型已有的视觉特征表达能力，将其迁移到 HEp-2 细胞分类任务中。项目重点是比较不同迁移策略在医学图像任务中的稳定性和适配程度。"
        ]
      },
      {
        key: "contribution",
        tab: "Contribution",
        title: "我的主要工作与贡献边界",
        bullets: [
          "构建 HEp-2 图像分类训练流程。",
          "基于 AlexNet 和 ResNet 替换分类头，使模型适配当前类别数。",
          "对比冻结 backbone 与部分微调策略对模型表现的影响。",
          "调整学习率、batch size、epoch、数据增强和优化器配置。",
          "从类别混淆、错误样例和特征表达角度分析模型表现。",
          "总结不同模型结构在医学图像分类任务中的适用边界。"
        ]
      },
      {
        key: "workflow",
        tab: "Workflow",
        title: "系统流程",
        paragraphs: [
          "项目首先对 HEp-2 图像进行预处理，包括图像尺寸统一、归一化和训练集划分。随后基于预训练 AlexNet 和 ResNet 构建迁移学习模型，并替换最后的分类层以适配当前任务。",
          "训练过程中，我对不同迁移策略进行实验，包括冻结特征提取层、微调后部网络层和完整微调等方案。每一组实验都会记录模型在不同类别上的表现，并结合错误样例分析模型是否真正学习到细胞荧光模式，而不是依赖亮度或背景差异进行判断。",
          "在结果分析阶段，重点关注模型对相似荧光模式的区分能力，分析不同类别之间的混淆原因，以及 AlexNet、ResNet 等预训练模型在 HEp-2 细胞图像任务中的适配差异。"
        ]
      },
      {
        key: "highlights",
        tab: "Highlights",
        title: "关键技术亮点",
        bullets: [
          "**医学图像预处理与输入标准化**：统一尺寸、归一化和训练集划分，针对亮度差异、细胞边界不清晰和局部纹理变化采用适度数据增强。",
          "**迁移学习模型适配**：基于 AlexNet 和 ResNet 替换分类头，对比冻结 backbone、部分微调和完整微调策略。",
          "**AlexNet 与 ResNet 结构对比**：分析浅层模型和深层模型在细胞荧光模式识别中的差异。",
          "**微调策略与参数控制**：在保持预训练特征稳定和适配当前任务之间取得平衡。",
          "**类别级错误分析**：判断错误来源是类别本身视觉差异较小、样本质量不稳定，还是模型特征表达能力不足。",
          "**可复现实验记录**：保留不同模型结构、训练参数、微调策略和评估结果，使实验过程可以被复查和比较。"
        ]
      },
      {
        key: "tech",
        tab: "Tech",
        title: "技术栈",
        paragraphs: ["Python, PyTorch, AlexNet, ResNet, Transfer Learning, Fine-tuning, Medical Image Classification, Model Evaluation"]
      },
      {
        key: "results",
        tab: "Results",
        title: "项目结果",
        paragraphs: [
          "本项目完成了一套基于迁移学习的 HEp-2 细胞图像分类实验流程，形成了从数据预处理、模型适配、微调实验到模型表现分析的完整过程。",
          "该项目体现了医学图像分类中模型解释和类别级分析的重要性。模型能否给出预测结果只是基础，更关键的是判断模型是否真正学习到细胞纹理和荧光模式特征。"
        ]
      }
    ]
  },
  {
    id: "bookstore",
    index: "04",
    title: "Online Bookstore Review System",
    direction: "企业合作项目 / 全栈 Web 应用 / 在线书城与评论系统",
    cover: "assets/case-bookstore.png",
    summary: "面向企业客户需求完成在线书城与评论系统 Demo，覆盖需求沟通、产品流程设计、前后端协作和最终完整性验证。",
    tags: ["React", "Node.js", "RTK Query", "REST API", "User Flow Testing"],
    stats: [["Type", "Full-stack Demo"], ["Flow", "Login to Payment"], ["Role", "Product Bridge"], ["Mode", "Client Collaboration"]],
    workflow: ["Client Meeting", "Requirement List", "User Flow", "API Alignment", "Testing", "Demo Delivery"],
    sections: [
      {
        key: "overview",
        tab: "Overview",
        title: "项目概览",
        paragraphs: [
          "本项目是一个面向企业客户需求的在线书城与评论系统设计项目。项目完成了一个 Web 应用 Demo，从客户需求理解、功能范围确认、远程会议沟通，到中期需求调整、前后端实现协作，再到最终产品完整性验证，完整模拟了企业客户项目从需求到交付的推进过程。"
        ],
        ordered: [
          "客户需求理解与功能定义：通过远程会议梳理客户对登录、书城浏览、评论、书架和付款页面的需求。",
          "产品流程设计与系统实现：将客户需求转化为页面流程、功能模块和接口协作方式。",
          "产品完整性验证：围绕核心用户路径进行测试，确保最终交付版本能够完整演示。"
        ]
      },
      {
        key: "problem",
        tab: "Problem",
        title: "项目背景与问题",
        paragraphs: [
          "在企业合作类 Web 项目中，真正的难点通常不是单个页面开发，而是客户需求、产品设计和技术实现之间的对齐。客户往往会从业务角度描述需求，例如希望用户能够搜索图书、查看评论、加入书架、登录账户或完成付款流程；开发团队需要把这些需求拆解为页面、接口、状态管理和测试用例。",
          "项目过程中，需求也会随着会议讨论不断调整。部分功能范围需要重新确认，部分页面流程需要根据客户反馈修改。因此，项目需要建立稳定的沟通和交付流程，让客户语言能够转化为可开发、可测试、可演示的产品功能。"
        ]
      },
      {
        key: "contribution",
        tab: "Contribution",
        title: "我的主要工作与贡献边界",
        paragraphs: [
          "我的工作更偏产品与交付方向，主要承担客户需求和技术实现之间的沟通桥梁角色。"
        ],
        bullets: [
          "参与远程会议，记录和整理客户对登录、书城浏览、评论、书架和付款页面的需求。",
          "将客户需求转化为功能清单、用户路径和页面模块。",
          "协助团队确认需求范围，处理开发过程中出现的功能变更。",
          "对接前后端实现，检查页面流程和 API 返回是否符合产品预期。",
          "负责最终产品完整性验证，包括登录流程、搜索流程、评论流程、书架操作和付款页面展示。",
          "整理演示脚本、测试记录和交付说明。"
        ]
      },
      {
        key: "workflow",
        tab: "Flow",
        title: "产品流程",
        paragraphs: [
          "项目首先通过远程会议理解客户需求，并将需求拆解为几个核心用户路径：用户登录后浏览图书，通过搜索找到目标书籍，查看详情和评论，将图书加入书架，并进入购买或付款相关页面。",
          "在设计阶段，我将这些需求整理为功能模块和页面流程，帮助团队明确哪些功能属于核心交付范围，哪些功能可以作为扩展内容。随着客户反馈变化，项目中也进行了多次范围调整，例如页面内容、交互方式和部分流程优先级的变更。",
          "在测试阶段，我围绕真实用户路径进行完整性验证。测试重点不是单独检查某个按钮是否可点击，而是检查用户从登录到浏览、搜索、评论、加入书架和进入付款页面的整体流程是否连贯，页面状态和数据反馈是否符合预期。"
        ]
      },
      {
        key: "highlights",
        tab: "Highlights",
        title: "关键技术亮点",
        bullets: [
          "**客户需求理解与功能拆解**：通过远程会议理解用户登录、图书浏览、关键词搜索、评论展示、书架管理和付款页面等功能需求，并整理为功能清单、页面模块和用户路径。",
          "**产品范围确认与变更管理**：用需求变更记录协助团队判断功能优先级，减少范围失控风险。",
          "**用户路径驱动的产品设计**：围绕登录、浏览、搜索、详情、评论、书架和付款路径组织功能和验证。",
          "**前后端实现协作与接口对齐**：保证前端页面状态、后端 API 返回和用户操作结果一致。",
          "**产品完整性验证**：模拟客户演示时的真实操作路径，提前发现影响展示和交付的问题。",
          "**交付材料与演示准备**：整理演示脚本、测试记录、功能说明和问题清单，提升最终展示稳定性。"
        ]
      },
      {
        key: "tech",
        tab: "Tech",
        title: "技术栈",
        paragraphs: ["React, Node.js, RTK Query, JavaScript, REST API, Product Requirement Analysis, User Flow Testing, Remote Collaboration"]
      },
      {
        key: "results",
        tab: "Results",
        title: "项目结果",
        paragraphs: [
          "本项目最终完成了一个面向企业客户需求的在线书城与评论系统原型，覆盖用户登录、图书浏览、搜索、评论、书架管理和付款页面等核心流程。我的贡献重点在于需求梳理、范围协调、客户沟通和产品完整性验证。",
          "该项目体现了产品型项目中的中间层价值：客户需求需要被转化为可执行任务，技术实现需要持续回到产品目标进行验证，最终交付需要同时满足功能完整性和演示稳定性。"
        ]
      }
    ]
  },
  {
    id: "qa",
    index: "05",
    title: "Software Quality Assurance and Management",
    direction: "软件质量保证 / 团队交付 / Java 游戏项目",
    cover: "assets/case-qa.png",
    summary: "在 Java 游戏团队项目中建立需求跟踪、测试计划、缺陷流转、阶段评审和验收准备机制，推动项目验收测试 100% 通过。",
    tags: ["Java", "QA Planning", "Test Case Design", "Defect Tracking", "Documentation"],
    stats: [["Acceptance", "100%"], ["Tasks", "30+"], ["Reviews", "10+"], ["Team", "5 people"]],
    workflow: ["Requirements", "Test Plan", "Defect Flow", "Stage Review", "Evidence", "Acceptance"],
    sections: [
      {
        key: "overview",
        tab: "Overview",
        title: "项目概览",
        paragraphs: [
          "本项目面向 Java 游戏开发与交付场景，目标是在团队协作开发过程中建立需求跟踪、测试计划、缺陷流转、阶段评审和验收准备机制。项目重点是通过 QA 流程保证团队交付质量，使游戏功能能够按需求完成、按标准测试、按证据验收。",
          "我作为团队负责人，带领 5 人团队推进项目执行，并将模糊的玩法需求拆解为可分配、可测试、可追踪的任务。"
        ]
      },
      {
        key: "problem",
        tab: "Problem",
        title: "项目背景与问题",
        paragraphs: [
          "Java 游戏项目涉及多个功能模块并行开发。如果没有清晰的质量管理流程，容易出现需求理解不一致、测试遗漏、缺陷责任不明确和里程碑前集中返工等问题。团队项目中的风险不只是代码 bug，也包括任务状态不透明、优先级混乱和验收证据不足。",
          "因此，本项目需要把团队开发过程管理起来：需求要能追踪，测试要能覆盖，缺陷要能闭环，评审要能推动决策，最终验收要有证据支撑。"
        ]
      },
      {
        key: "contribution",
        tab: "Contribution",
        title: "我的主要工作与贡献边界",
        bullets: [
          "将游戏需求拆解为可测试任务，并分配负责人。",
          "制定测试计划和测试用例，覆盖核心玩法与异常场景。",
          "建立缺陷等级、责任人、修复和复测流程。",
          "持续跟踪 30+ 项任务的进度和完成状态。",
          "组织 10+ 次阶段评审，判断里程碑前必须解决的问题。",
          "汇总验收材料、测试记录和最终质量证据。"
        ]
      },
      {
        key: "workflow",
        tab: "QA Flow",
        title: "质量管理流程",
        paragraphs: [
          "项目首先从需求梳理开始，将玩法目标、功能模块和交互逻辑拆解为可执行任务。每项任务明确负责人、完成标准和测试检查点，避免只描述“要做什么”而没有定义“怎样算完成”。",
          "在测试阶段，团队根据功能模块设计测试用例，并记录执行结果。发现问题后，我根据影响范围和严重程度进行分级，明确修复责任人，并安排复测确认。对于影响验收或核心玩法的问题，通过阶段评审决定优先级和处理时限。",
          "最终，项目将测试记录、缺陷闭环情况、评审记录和验收清单整理为交付材料，支持最终验收。"
        ]
      },
      {
        key: "highlights",
        tab: "Highlights",
        title: "关键技术亮点",
        bullets: [
          "**需求到测试的可追踪链路**：将游戏需求转化为测试项，并为核心玩法、交互逻辑和异常情况建立对应验证方式。",
          "**缺陷闭环机制**：缺陷处理流程覆盖发现、分级、分配、修复和复测，避免缺陷停留在口头沟通或未确认状态。",
          "**阶段评审驱动交付**：通过 10+ 次阶段评审提前暴露风险，判断里程碑前必须修复的问题。",
          "**团队任务透明化管理**：持续跟踪 30+ 项任务，包括任务状态、负责人、完成进度、阻塞问题和复测结果。",
          "**验收证据沉淀**：最终交付材料包括测试记录、缺陷闭环情况、阶段评审记录和验收清单，使验收可以被复查。"
        ]
      },
      {
        key: "tech",
        tab: "Tech",
        title: "技术栈",
        paragraphs: ["Java, QA Planning, Test Case Design, Defect Tracking, Milestone Review, Documentation, Team Management"]
      },
      {
        key: "results",
        tab: "Results",
        title: "项目结果",
        paragraphs: [
          "本项目最终推动 Java 游戏项目完成验收准备，并实现验收测试 **100% 通过**。项目过程中持续跟踪 **30+ 项任务**，组织 **10+ 次阶段评审**，帮助团队建立了更清晰的质量控制和交付节奏。",
          "该项目强化了我对 QA 前置的理解：质量保证不是开发完成后的补充测试，而是从需求拆解、责任分配、测试设计和缺陷闭环开始介入，使团队交付真正可控。"
        ]
      }
    ]
  }
];

const LANGUAGE_STORAGE_KEY = "yunxiao-portfolio-language";

const SITE_COPY = {
  zh: {
    "common.skip": "跳到主内容",
    "common.contactMe": "联系我",
    "nav.home": "首页",
    "nav.about": "关于",
    "nav.experience": "经历",
    "nav.projects": "项目",
    "nav.life": "生活",
    "nav.contact": "联系",
    "home.heroHeading": "你好，我是<br />赵云骁",
    "home.heroLead": "专注 Applied AI、Software Engineering 和可复查交付的项目型工程师。",
    "home.viewCasebook": "查看 Casebook",
    "home.politicsLabel": "政治面貌",
    "home.politicsValue": "中共党员",
    "home.politicsMeta": "责任意识 · 执行力",
    "home.educationLabel": "教育背景",
    "home.educationValue": "悉尼大学",
    "home.educationMeta": "软件工程硕士（AI方向）",
    "home.techLabel": "技术方向",
    "home.techValue": "AI / Software Engineering",
    "home.aboutLabel": "// 关于",
    "home.aboutHeading": "关于我",
    "home.aboutP1": "我目前在悉尼大学攻读 Software Engineering 硕士，方向集中在 AI 应用、Computer Vision、模型评估和工程交付。本科为 Artificial Intelligence，长期关注技术结果如何被解释、测试和复查。",
    "home.aboutP2": "我的项目会把模型实验、系统实现、测试证据、项目文档和真实用户流程串起来，让结果不仅能跑起来，也能被展示、验证和继续扩展。",
    "home.focusLabel": "// 方向",
    "home.focusHeading": "技术方向",
    "home.focusTitle1": "AI 应用开发",
    "home.focusTitle2": "软件工程实现",
    "home.focusTitle3": "质量验证交付",
    "home.focusTitle4": "产品与方案思维",
    "home.focusTitle5": "团队组织推进",
    "home.focus1": "Computer Vision、模型训练、Data Cleaning、评估和视觉证据流程。",
    "home.focus2": "Python、Java、SQL、HTML/CSS、Git/GitHub、脚本、API 和可靠实现。",
    "home.focus3": "QA Planning、Test Cases、Defect Tracking、Regression、验收证据和文档。",
    "home.focus4": "需求分析、User Flow 验证、客户沟通、范围控制和 Demo 交付。",
    "home.focus5": "任务拆解、Milestone Review、跨团队协作、项目协调和交付节奏。",
    "home.projectsLabel": "// Casebook",
    "home.projectsHeading": "项目",
    "home.contactLabel": "// 联系",
    "home.contactHeading": "一起做可解释、可测试、可交付的系统。",
    "home.contactText": "我关注 Software Engineering、Applied AI、Product、Solution Consulting 和交付型岗位。",
    "home.contactCta": "开始沟通",
    "experience.label": "// 经历",
    "experience.heading": "经历",
    "experience.lead": "我的经历集中在 Software Testing、Solution Analysis、团队协作和质量交付。核心方法是把需求拆成可执行任务，再用测试、文档和复盘让结果可追踪。",
    "experience.exp1Company": "北京煜邮信息科技有限公司",
    "experience.exp1Role": "测试工程师实习生",
    "experience.exp1Text": "围绕智能电表及终端采集器的测试交付与质量提升，编写并执行 20+ 套测试方案与用例，参与 15+ 次软/硬件测试环境搭建与回归验证，协同研发及硬件团队定位 10+ 个关键缺陷并推动问题闭环。",
    "experience.exp2Company": "北大医疗信息技术有限公司",
    "experience.exp2Role": "解决方案实习生",
    "experience.exp2Text": "围绕智慧医疗解决方案投标与方案优化，负责竞品与行业研究、医院信息化需求访谈及方案设计支持，完成 5+ 份竞品/行业分析，梳理 5+ 家医院需求，并将调研结论转化为可落地的业务优化建议。",
    "experience.exp3Company": "北京建筑大学电信学院学生会",
    "experience.exp3Role": "学生会主席",
    "experience.exp3Text": "统筹 20+ 名志愿者与学生干部，主导策划并执行 10+ 场大型校内外活动，负责活动排期、任务拆解、进度推进、现场协调、预算台账和复盘材料。",
    "experience.eduTitle": "悉尼大学 / 北京建筑大学",
    "experience.eduRole": "软件工程硕士（AI方向） / 人工智能学士",
    "experience.eduText": "主修智能视觉与 Deep Learning、面向对象编程、计算机与网络安全、Software Engineering Management、Quality Engineering Management。本科 GPA 3.5，专业前 10%，三次校级奖学金。",
    "experience.styleLabel": "// 工作方式",
    "experience.styleHeading": "Explainable, testable, deliverable.",
    "experience.styleText": "我倾向于做能够被解释、测试、复查和交接的工作。这个习惯贯穿我的测试、AI 项目、解决方案和组织管理经历。",
    "experience.viewProjects": "查看项目",
    "projects.heroLabel": "// Casebook",
    "projects.heroTitle": "项目",
    "projects.heroLead": "精选 AI、Web 与 Software Quality 相关项目，展示从问题定义、技术实现到结果验证的完整过程。",
    "projects.openCases": "打开 Cases",
    "projects.sectionLabel": "// 项目",
    "life.label": "// 生活",
    "life.heading": "Life",
    "life.lead": "运动、山野、海水和摄影，是我在项目之外保持稳定、好奇和行动力的方式。"
  },
  en: {
    "common.skip": "Skip to content",
    "common.contactMe": "Contact Me",
    "nav.home": "Home",
    "nav.about": "About",
    "nav.experience": "Experience",
    "nav.projects": "Projects",
    "nav.life": "Life",
    "nav.contact": "Contact",
    "home.heroHeading": "Hi, I'm<br />Yunxiao",
    "home.heroLead": "A project-oriented engineer focused on Applied AI, Software Engineering, and inspectable delivery.",
    "home.viewCasebook": "View Casebook",
    "home.politicsLabel": "Civic Identity",
    "home.politicsValue": "CPC Member",
    "home.politicsMeta": "Responsibility · Execution",
    "home.educationLabel": "Education",
    "home.educationValue": "University of Sydney",
    "home.educationMeta": "Master of Software Engineering (AI)",
    "home.techLabel": "Technical Focus",
    "home.techValue": "AI / Software Engineering",
    "home.aboutLabel": "// About",
    "home.aboutHeading": "About Me",
    "home.aboutP1": "I am pursuing a Master of Software Engineering at the University of Sydney, with a focus on AI applications, Computer Vision, model evaluation, and engineering delivery. My undergraduate background is Artificial Intelligence, and I care about whether technical results can be explained, tested, and reviewed.",
    "home.aboutP2": "My projects connect model experiments, system implementation, testing evidence, documentation, and real user flows so the result is not only runnable, but also presentable, verifiable, and extensible.",
    "home.focusLabel": "// Focus",
    "home.focusHeading": "Focus Areas",
    "home.focusTitle1": "Applied AI",
    "home.focusTitle2": "Software Engineering",
    "home.focusTitle3": "Quality Delivery",
    "home.focusTitle4": "Product Thinking",
    "home.focusTitle5": "Team Leadership",
    "home.focus1": "Computer Vision, model training, Data Cleaning, evaluation, and visual evidence workflows.",
    "home.focus2": "Python, Java, SQL, HTML/CSS, Git/GitHub, scripts, APIs, and reliable implementation.",
    "home.focus3": "QA Planning, Test Cases, Defect Tracking, Regression, acceptance evidence, and documentation.",
    "home.focus4": "Requirement analysis, User Flow validation, customer communication, scope control, and demos.",
    "home.focus5": "Task breakdown, Milestone Review, cross-team collaboration, project coordination, and delivery rhythm.",
    "home.projectsLabel": "// Casebook",
    "home.projectsHeading": "Projects",
    "home.contactLabel": "// Contact",
    "home.contactHeading": "Let's build explainable, testable, deliverable systems.",
    "home.contactText": "I am interested in Software Engineering, Applied AI, Product, Solution Consulting, and delivery-focused roles.",
    "home.contactCta": "Start a conversation",
    "experience.label": "// Experience",
    "experience.heading": "Experience",
    "experience.lead": "My experience spans Software Testing, Solution Analysis, team collaboration, and quality delivery. I turn requirements into executable work, then use testing, documentation, and reviews to make outcomes traceable.",
    "experience.exp1Company": "Beijing Yuyou Power Technology Co., Ltd.",
    "experience.exp1Role": "Test Engineer Intern",
    "experience.exp1Text": "Supported testing delivery and quality improvement for smart meters and terminal collectors. Wrote and executed 20+ test plans and cases, participated in 15+ software/hardware test environment setups and regression checks, and worked with R&D and hardware teams to locate 10+ key defects and close the loop.",
    "experience.exp2Company": "Peking University Medical Information Technology Co., Ltd.",
    "experience.exp2Role": "Solution Intern",
    "experience.exp2Text": "Supported smart healthcare solution bids and proposal optimization through competitor research, industry research, hospital information-system requirement interviews, and solution design. Produced 5+ analysis reports, summarized needs from 5+ hospitals, and translated research into practical business suggestions.",
    "experience.exp3Company": "Student Union, School of Electrical and Information Engineering",
    "experience.exp3Role": "Student Union President",
    "experience.exp3Text": "Coordinated 20+ volunteers and student leaders, planned and executed 10+ large campus and external events, and handled scheduling, task breakdown, progress tracking, on-site coordination, budget records, and review materials.",
    "experience.eduTitle": "University of Sydney / Beijing University of Civil Engineering and Architecture",
    "experience.eduRole": "Master of Software Engineering (AI) / B.Eng. Artificial Intelligence",
    "experience.eduText": "Coursework includes Computer Vision, Deep Learning, Object-Oriented Programming, Computer and Network Security, Software Engineering Management, and Quality Engineering Management. Undergraduate GPA 3.5, top 10% in major, and three university scholarships.",
    "experience.styleLabel": "// Working Style",
    "experience.styleHeading": "Explainable, testable, deliverable.",
    "experience.styleText": "I prefer work that can be explained, tested, reviewed, and handed over. This habit runs through my testing work, AI projects, solution analysis, and team-management experience.",
    "experience.viewProjects": "View Projects",
    "projects.heroLabel": "// Casebook",
    "projects.heroTitle": "Projects",
    "projects.heroLead": "Selected AI, Web, and Software Quality projects, covering problem definition, technical implementation, and result validation.",
    "projects.openCases": "Open Cases",
    "projects.sectionLabel": "// Projects",
    "life.label": "// Life",
    "life.heading": "Life",
    "life.lead": "Sports, mountains, water, and photography help me stay stable, curious, and action-oriented beyond project work."
  }
};

const PAGE_META = {
  home: {
    zh: "赵云骁 | AI & Software Portfolio",
    en: "Yunxiao Zhao | AI & Software Portfolio"
  },
  experience: {
    zh: "经历 | 赵云骁",
    en: "Experience | Yunxiao Zhao"
  },
  projects: {
    zh: "项目 | 赵云骁",
    en: "Projects | Yunxiao Zhao"
  },
  life: {
    zh: "生活 | 赵云骁",
    en: "Life | Yunxiao Zhao"
  }
};

const PROJECT_SECTION_TABS_EN = {
  overview: "Overview",
  problem: "Problem",
  contribution: "Contribution",
  workflow: "Workflow",
  model: "Model",
  direction: "Direction",
  stack: "Stack",
  highlights: "Highlights",
  results: "Results"
};

const PROJECT_COPY_EN = {
  tennis: {
    direction: "AI Video Understanding / Sports Intelligence / Tennis Stroke Semantics",
    summary: "Automatically identifies when a stroke happens, who hits it, whether it is Forehand or Backhand, and whether the ball goes Cross-court or Down-the-line from broadcast tennis video.",
    sections: {
      overview: {
        title: "Project Overview",
        paragraphs: [
          "This project targets stroke-level semantic understanding in broadcast tennis videos. It converts frame-level player, ball, and court tracking outputs into interpretable, trainable, and reviewable stroke-level records.",
          "Each output record includes hit frame, hitter, stroke type, stroke direction, confidence, and visual evidence for match review, player technique analysis, and future tactical statistics."
        ],
        ordered: [
          "Stroke type recognition: Forehand / Backhand.",
          "Stroke direction analysis: Cross-court / Down-the-line."
        ]
      },
      problem: {
        title: "Background and Problem",
        paragraphs: [
          "Tennis video analysis begins with player detection, ball tracking, court keypoint detection, and trajectory visualization. Those frame-level measurements describe where entities are, but not what the stroke means.",
          "The core challenge is building an event-centric bridge from low-level perception outputs to stroke-level semantic records that can support classification and review."
        ],
        bullets: [
          "When does a true stroke occur?",
          "Which player completes the stroke?",
          "Is the stroke Forehand or Backhand?",
          "Is the outgoing trajectory Cross-court or Down-the-line?",
          "Is there enough visual evidence for each decision?"
        ]
      },
      contribution: {
        title: "My Work and Contribution Boundary",
        paragraphs: [
          "The project was built on an existing tennis-analysis baseline. I reproduced and adapted player detection, ball detection, court keypoint detection, and basic tracking modules as inputs, while my original work focused on the semantic layer after the baseline."
        ],
        bullets: [
          "Designed hit-event logic to locate hit_frame and hitter_id from continuous trajectories.",
          "Built event-level exports for clips, local image regions, and post-hit trajectory evidence.",
          "Fine-tuned a VideoMAE-base model for FH/BH recognition.",
          "Designed a Random Forest direction classifier from trajectory geometry features.",
          "Established evaluation for event detection, stroke type recognition, and direction analysis."
        ]
      },
      workflow: {
        title: "System Workflow",
        paragraphs: [
          "The system first converts broadcast video into a unified video__tracks.csv table containing player boxes, ball positions, court keypoints, and coordinate mapping results.",
          "A rule-driven event detector combines player-ball distance, ball speed, trajectory direction change, bounce suppression, and temporal deduplication to extract hit anchors represented by hit_frame + hitter_id.",
          "Around each event anchor, the system exports a centered video clip, local visual regions, and post-hit trajectory evidence, turning frame-level tracking into stroke-event samples."
        ]
      },
      model: {
        title: "Stroke Type Recognition",
        paragraphs: [
          "The stroke-type branch uses a Kinetics-pretrained VideoMAE-base model for Forehand / Backhand classification. It crops 16-frame clips around the hitting player and replaces the original classification head for the FH/BH task.",
          "With conservative backbone updates on a small manually labeled dataset, the branch reached 95.45% accuracy, improving the initial VideoMAE baseline by 21.60 pp."
        ]
      },
      direction: {
        title: "Direction Analysis",
        paragraphs: [
          "The direction branch reframes Cross-court / Down-the-line prediction as an event-level trajectory geometry classification problem. It focuses on post-hit trajectory direction, landing trend, and the court centerline relationship rather than a single frame.",
          "Each event yields 67 numeric features including confidence, trajectory direction, displacement, centerline relation, completeness, and quality diagnostics. An 800-tree Random Forest reached 88.64% accuracy, improving the YOLO shot-level image baseline by 21.97 pp."
        ]
      },
      stack: {
        title: "Technical Stack",
        paragraphs: ["Python, PyTorch, HuggingFace Transformers, VideoMAE, OpenCV, YOLO, ResNet50, scikit-learn, Random Forest, pandas, NumPy"]
      },
      highlights: {
        title: "Technical Highlights",
        bullets: [
          "Event-level semantic bridge from player / ball / court tracking results to stroke records.",
          "Small-sample video action recognition using VideoMAE-base and event-centered clips.",
          "Trajectory geometry modeling for CC/DTL direction classification.",
          "Interpretable output records with hit frame, hitter, trajectory evidence, and confidence.",
          "Error diagnosis for tracking noise, court calibration sensitivity, DTL imbalance, and non-baseline strokes."
        ]
      },
      results: {
        title: "Results",
        bullets: [
          "Hit event detection F1 score: 88.89%.",
          "FH/BH stroke type recognition accuracy: 95.45%.",
          "CC/DTL direction analysis accuracy: 88.64%.",
          "VideoMAE branch improved the initial baseline by 21.60 pp.",
          "Random Forest direction branch improved the YOLO shot-level baseline by 21.97 pp."
        ],
        paragraphs: [
          "The project validates the feasibility of an event-level semantic workflow for broadcast tennis videos and provides a foundation for more stroke categories, semi-automatic dataset building, tactical analysis, and next-shot prediction."
        ]
      }
    }
  },
  agriculture: {
    direction: "AI Image Recognition / Smart Agriculture / Tomato Leaf Disease Detection",
    summary: "Builds a complete experiment pipeline from raw agricultural images to a verifiable disease-recognition model, with strong emphasis on data quality, label QA, augmentation, and error analysis.",
    sections: {
      overview: { title: "Project Overview", paragraphs: ["This project focuses on tomato leaf disease recognition under real-world image conditions such as unstable lighting, complex backgrounds, occlusion, subtle disease texture, and inconsistent annotation quality."], ordered: ["Data cleaning and label quality control.", "YOLO / ResNet model training and structure comparison.", "Optimization through augmentation, loss tuning, attention mechanisms, and training strategy updates."] },
      problem: { title: "Background and Problem", paragraphs: ["The main difficulty comes from the data itself. Blurry images, tiny disease regions, background interference, underexposure, overexposure, and shifted boxes can make the model learn noise rather than disease features.", "A reliable data-quality workflow is required before model-structure optimization becomes meaningful."] },
      contribution: { title: "My Work and Contribution Boundary", paragraphs: ["I served as team lead and was responsible for data processing workflow design, experiment planning, model-optimization coordination, and result consolidation."], bullets: ["Designed a semi-automated data screening process.", "Organized manual QA for disease clarity, box coverage, and class correctness.", "Designed augmentation strategies for realistic agricultural-image variation.", "Coordinated YOLO and ResNet comparison experiments.", "Tracked precision, recall, false positives, false negatives, and typical error cases."] },
      workflow: { title: "System Workflow", paragraphs: ["The system first checks file integrity, resolution, brightness, blur level, missing annotations, box validity, and abnormal class IDs. Suspicious samples are listed for human QA instead of entering training directly.", "After cleaning, the dataset is split into train, validation, and test sets. Baseline YOLO / ResNet models are trained, followed by iterative experiments with augmentation, attention modules, GIoU loss, learning-rate tuning, batch-size changes, and epoch strategy updates."] },
      stack: { title: "Technical Stack", paragraphs: ["Python, PyTorch, YOLO, ResNet, OpenCV, Attention Mechanism, GIoU, Data Cleaning, Data Augmentation, Model Evaluation"] },
      highlights: { title: "Technical Highlights", bullets: ["Semi-automated data cleaning and label QA workflow.", "Field-image augmentation strategy for lighting, color, rotation, scale, flip, crop, and background interference.", "YOLO and ResNet dual-route model comparison.", "Multi-round model-structure and training-strategy optimization.", "Error-case-driven experiment loop from training to evaluation to cleanup and retraining."] },
      results: { title: "Results", paragraphs: ["Through data cleaning, augmentation, and multi-round model optimization, the project improved disease detection accuracy from around 70% to 88%+. It produced a complete experimental loop covering data quality control, model training, comparison, tuning, and error analysis."] }
    }
  },
  hep2: {
    direction: "Medical Image Analysis / Transfer Learning / HEp-2 Cell Image Classification",
    summary: "Uses transfer learning to classify HEp-2 immunofluorescence cell images and compares AlexNet and ResNet adaptation strategies for medical image classification.",
    sections: {
      overview: { title: "Project Overview", paragraphs: ["This project classifies HEp-2 immunofluorescence cell images into different fluorescence patterns using transfer learning. It emphasizes a stable medical-image classification pipeline and model-adaptation analysis."], ordered: ["Medical image preprocessing.", "Transfer learning with AlexNet and ResNet.", "Model performance analysis through class confusion, feature expression, and generalization."] },
      problem: { title: "Background and Problem", paragraphs: ["HEp-2 images have similar fluorescence patterns across classes and significant variation within each class due to brightness, morphology, and cell-boundary changes. Training from scratch is unstable under limited samples.", "Transfer learning can reuse pretrained CNN visual features while adapting the classification head and fine-tuning strategy for the current task."] },
      contribution: { title: "My Work and Contribution Boundary", bullets: ["Built the HEp-2 image classification training workflow.", "Replaced AlexNet and ResNet classification heads for the target classes.", "Compared frozen backbone, partial fine-tuning, and full fine-tuning.", "Adjusted learning rate, batch size, epoch count, augmentation, and optimizer settings.", "Analyzed class confusion, error samples, and feature-expression boundaries."] },
      workflow: { title: "System Workflow", paragraphs: ["The pipeline standardizes image size, normalization, and train/validation/test splitting. It then builds transfer-learning models from pretrained AlexNet and ResNet and replaces the final classification layer.", "Experiments compare freezing feature extractors, fine-tuning later layers, and full fine-tuning. Evaluation focuses on whether the model learns fluorescence-pattern features rather than brightness, background, or sample noise."] },
      stack: { title: "Technical Stack", paragraphs: ["Python, PyTorch, AlexNet, ResNet, Transfer Learning, Fine-tuning, Medical Image Classification, Model Evaluation"] },
      highlights: { title: "Technical Highlights", bullets: ["Medical image preprocessing and input standardization.", "Transfer-learning adaptation with replaced classification heads.", "AlexNet and ResNet structure comparison.", "Controlled fine-tuning strategy under limited medical-image data.", "Class-level error analysis for similar fluorescence patterns.", "Reproducible experiment records across model structures, parameters, and evaluation results."] },
      results: { title: "Results", paragraphs: ["The project delivered a complete transfer-learning workflow for HEp-2 cell image classification and summarized the suitability and limitations of pretrained CNNs for this medical-image task. It emphasizes not only prediction output, but also whether the model truly learns cellular texture and fluorescence patterns."] }
    }
  },
  bookstore: {
    direction: "Enterprise Collaboration / Full-stack Web Application / Online Bookstore Review System",
    summary: "A client-oriented online bookstore and review-system demo covering requirement understanding, product-flow design, front-end/back-end alignment, and final product validation.",
    sections: {
      overview: { title: "Project Overview", paragraphs: ["This enterprise-collaboration project delivered a Web application demo for an online bookstore and review system. It simulated the full path from client requirement communication to scope alignment, implementation collaboration, testing, and final demo readiness."], ordered: ["Client requirement understanding and feature definition.", "Product-flow design and system implementation.", "Product completeness validation across core user paths."] },
      problem: { title: "Background and Problem", paragraphs: ["The challenge was aligning client language, product design, and technical implementation. Client needs such as login, browsing, comments, bookshelf, and payment flow had to be translated into pages, interfaces, states, and testable user paths.", "Because requirements changed during meetings, the project also needed scope tracking and delivery discipline."] },
      contribution: { title: "My Work and Contribution Boundary", paragraphs: ["My role was closer to product and delivery coordination, acting as a bridge between client requirements and implementation."], bullets: ["Recorded and organized remote-meeting requirements.", "Converted client needs into feature lists, user paths, and page modules.", "Helped confirm scope and handle changes during development.", "Checked front-end flows and API responses against product expectations.", "Validated login, search, review, bookshelf, and payment-page paths.", "Prepared demo scripts, test records, and delivery notes."] },
      workflow: { title: "Product Flow", paragraphs: ["The core user path starts from login, browsing books, searching for a target book, reading detail and comments, adding books to the bookshelf, and entering the purchase or payment-related page.", "Testing focused on complete user paths rather than isolated button checks, ensuring page states and data feedback worked coherently during the demo."] },
      stack: { title: "Technical Stack", paragraphs: ["React, Node.js, RTK Query, JavaScript, REST API, Product Requirement Analysis, User Flow Testing, Remote Collaboration"] },
      highlights: { title: "Technical Highlights", bullets: ["Client requirement understanding and feature breakdown.", "Scope confirmation and change management.", "User-path-driven product design.", "Front-end/back-end implementation collaboration and API alignment.", "Product completeness validation for demo-critical flows.", "Delivery materials and presentation preparation."] },
      results: { title: "Results", paragraphs: ["The project delivered an online bookstore and review-system prototype covering login, browsing, search, comments, bookshelf management, and payment-page entry. My contribution focused on requirement organization, scope coordination, client communication, and product completeness validation."] }
    }
  },
  qa: {
    direction: "Software Quality Assurance / Team Delivery / Java Game Project",
    summary: "Built a QA and delivery-management process for a Java game team project, covering requirements tracking, test planning, defect closure, milestone reviews, and acceptance evidence.",
    sections: {
      overview: { title: "Project Overview", paragraphs: ["This project focused on Java game development and delivery. As team lead, I managed a five-person team and converted fuzzy gameplay requirements into assignable, testable, and trackable tasks."] },
      problem: { title: "Background and Problem", paragraphs: ["Parallel Java game modules can easily create inconsistent requirement understanding, missed tests, unclear defect ownership, and late-stage rework. Risks include not only code bugs, but also opaque task status, confused priorities, and insufficient acceptance evidence.", "The project therefore needed a process for requirement tracking, test coverage, defect closure, review-driven decisions, and evidence-based acceptance."] },
      contribution: { title: "My Work and Contribution Boundary", bullets: ["Broke gameplay requirements into testable tasks and assigned owners.", "Created test plans and cases for core gameplay and edge cases.", "Established defect severity, ownership, fix, and retest processes.", "Tracked 30+ tasks across progress, blockers, and retest results.", "Organized 10+ stage reviews before milestones.", "Consolidated acceptance materials, test records, and quality evidence."] },
      workflow: { title: "Quality Management Flow", paragraphs: ["The process began by translating gameplay goals, functional modules, and interactions into executable tasks. Each task had an owner, completion standard, and testing checkpoint.", "During testing, defects were ranked by severity and impact, assigned to owners, fixed, and retested. Stage reviews determined what had to be addressed before each milestone.", "Final delivery materials included test records, defect closure status, review records, and an acceptance checklist."] },
      stack: { title: "Technical Stack", paragraphs: ["Java, QA Planning, Test Case Design, Defect Tracking, Milestone Review, Documentation, Team Management"] },
      highlights: { title: "Technical Highlights", bullets: ["Traceable link from requirements to testing.", "Closed-loop defect management from discovery to retest.", "Stage-review-driven delivery control.", "Transparent management of 30+ team tasks.", "Acceptance evidence through test records, defect closure, reviews, and checklists."] },
      results: { title: "Results", paragraphs: ["The Java game project reached acceptance readiness and achieved 100% acceptance-test pass. The team tracked 30+ tasks and held 10+ stage reviews, building a clearer quality-control and delivery rhythm."] }
    }
  }
};

const EXPERIENCE_DATA = [
  {
    id: "yupont",
    date: "2024.03 - 2024.07",
    tags: ["Test Plan", "Regression", "Defect Tracking", "Smart Hardware"],
    zh: {
      title: "北京煜邦电力技术股份有限公司",
      role: "测试工程师实习生",
      direction: "智能硬件测试 / 产品质量验证 / 软硬件协同",
      preview: "参与智能电表及终端采集器的测试交付工作，围绕测试方案设计、软硬件环境搭建、回归验证和缺陷闭环展开。",
      sections: [
        {
          title: "经历概览",
          paragraphs: [
            "在北京煜邦电力技术股份有限公司实习期间，我参与智能电表及终端采集器的测试交付工作，主要围绕测试方案设计、软硬件环境搭建、回归验证和缺陷闭环展开。该经历让我接触到智能硬件产品在交付前的质量验证流程，也让我理解了测试工作如何连接产品需求、研发修复、硬件环境和最终交付结果。"
          ]
        },
        {
          title: "工作内容",
          paragraphs: [
            "实习期间，我根据智能电表及终端采集器的功能要求，编写并执行 **20+ 套测试方案与测试用例**，覆盖基础功能验证、通信链路检查、数据采集稳定性和异常场景测试。",
            "在测试执行过程中，我参与 **15+ 次软 / 硬件测试环境搭建**，包括设备连接、软件版本配置、终端采集器调试、测试数据记录和回归验证。对于测试中发现的问题，我会记录复现步骤、测试环境、设备状态、版本信息和异常表现，并同步给研发及硬件团队进行定位。",
            "在缺陷处理阶段，我协同研发及硬件团队定位 **10+ 个关键缺陷**，跟踪问题从发现、复现、定位、修复到回归验证的完整过程。通过更标准化的测试记录和问题追踪方式，帮助产品一次性通过率提升至 **80%**，平均问题解决周期缩短约 **20%**。"
          ]
        },
        {
          title: "关键能力亮点",
          bullets: [
            "**从需求到测试场景的转化**：能够将产品功能要求拆解为具体测试项，明确测试条件、输入数据、预期结果和异常情况，使产品能力可以被逐项验证。",
            "**软硬件协同问题定位**：测试过程涉及软件版本、硬件设备、终端采集器和通信环境，需要判断问题来自软件逻辑、硬件状态、环境配置还是设备交互。",
            "**缺陷记录与闭环跟踪**：缺陷记录不仅描述现象，还包含复现步骤、测试环境和影响范围，便于研发与硬件团队快速定位，并通过回归验证确认修复结果。",
            "**面向交付的质量意识**：测试重点不只是发现问题，而是推动问题被定位、修复和验证，减少关键缺陷进入交付阶段。"
          ]
        },
        {
          title: "经验沉淀",
          paragraphs: [
            "这段实习让我形成了更强的产品质量意识。对于软硬件结合产品来说，测试不仅是执行用例，更是用结构化证据判断产品是否具备交付条件。后续在项目和产品工作中，我也延续了这种“需求可验证、问题可追踪、结果可复查”的工作方式。"
          ]
        }
      ]
    },
    en: {
      title: "Yupont Electric Power Technology Co., Ltd.",
      role: "Test Engineer Intern",
      direction: "Smart Hardware Testing / Product Quality Validation / Software-Hardware Collaboration",
      preview: "Worked on testing delivery for smart meters and terminal collectors, covering test-plan design, environment setup, regression validation, and defect closure.",
      sections: [
        { title: "Experience Overview", paragraphs: ["During my internship at Yupont, I participated in testing delivery for smart meters and terminal collectors. The work covered test-plan design, software/hardware environment setup, regression validation, and defect tracking. It helped me understand how testing connects product requirements, R&D fixes, hardware conditions, and final delivery."] },
        { title: "Work", paragraphs: ["I wrote and executed 20+ test plans and cases for functional validation, communication-link checks, data-collection stability, and abnormal scenarios.", "I participated in 15+ software/hardware test environment setups, including device connection, software version configuration, terminal debugging, test-data recording, and regression validation.", "I worked with R&D and hardware teams to locate 10+ key defects and followed issues from discovery and reproduction to fixing and regression checks. More structured records helped raise one-time pass rate to 80% and shorten average issue-resolution time by about 20%."] },
        { title: "Capability Highlights", bullets: ["Translating product requirements into concrete test scenarios.", "Diagnosing issues across software versions, hardware devices, terminal collectors, and communication environments.", "Recording defects with reproduction steps, environment details, and impact scope.", "Maintaining delivery-oriented quality awareness from discovery to fix validation."] },
        { title: "Reflection", paragraphs: ["This internship strengthened my product-quality mindset. For software-hardware products, testing is not only executing cases, but also using structured evidence to judge whether a product is ready for delivery."] }
      ]
    }
  },
  {
    id: "pkumed",
    date: "2021.11 - 2022.02",
    tags: ["Healthcare IT", "Requirement Research", "Proposal", "Bid Support"],
    zh: {
      title: "北大医疗信息有限公司",
      role: "解决方案实习生",
      direction: "智慧医疗 / 医院信息化 / 方案调研与投标支持",
      preview: "参与智慧医疗解决方案的调研、方案优化和投标支持，围绕医院信息化需求、行业研究、竞品分析和方案材料展开。",
      sections: [
        { title: "经历概览", paragraphs: ["在北大医疗信息有限公司实习期间，我参与智慧医疗解决方案的调研、方案优化和投标支持工作。工作内容围绕医院信息化需求梳理、行业与竞品研究、业务优化建议和方案材料整理展开。", "这段经历让我接触到解决方案工作的完整前期过程：理解客户场景、拆解业务需求、研究竞品方案，再将调研结论转化为方案表达和投标材料。"] },
        { title: "工作内容", paragraphs: ["实习期间，我围绕智慧医疗解决方案投标与方案优化，完成 **5+ 份竞品 / 行业分析**，梳理不同厂商在医院信息化建设、系统集成、业务流程优化和数据管理等方向上的方案特点。", "在需求调研方面，我整理 **5+ 家医院信息化需求**，将访谈和调研材料中的分散信息转化为结构化需求记录，提炼医院在流程效率、系统协同、信息管理和服务体验方面的关键诉求。", "基于调研结果，我协助形成 **3 项可落地业务优化建议**，并支持 IIH 相关项目方案迭代与投标推进。相关工作助力 **2 个项目入围投标**，推动方案评审得分较初稿提升 **15%**，项目市场定位判断准确率提升至 **95%**。"] },
        { title: "关键能力亮点", bullets: ["**客户场景理解**：能够从医院访谈和需求材料中提炼真实业务问题，区分客户表达中的表层需求和背后的流程痛点。", "**行业与竞品分析**：通过整理竞品方案、行业趋势和典型应用场景，判断不同方案在功能覆盖、业务价值和落地路径上的差异。", "**需求到方案的转化**：将调研结论整理为可落地业务优化建议，使方案不只是功能罗列，而是能够回应医院真实管理和业务场景。", "**方案材料结构化表达**：参与投标材料和方案文档优化，使方案逻辑更清晰，更容易被评审理解和比较。", "**业务与技术之间的连接意识**：在智慧医疗场景中，技术方案需要服务于医院流程、管理效率和用户体验，而不是单独展示系统功能。"] },
        { title: "经验沉淀", paragraphs: ["这段实习让我更清楚地理解了解决方案工作的核心：先理解客户业务，再定义问题，最后组织方案。相比单纯做资料整理，更重要的是把行业研究、客户需求和技术能力连接起来，形成可被客户理解和认可的表达。"] }
      ]
    },
    en: {
      title: "Peking University Medical Information Co., Ltd.",
      role: "Solution Intern",
      direction: "Smart Healthcare / Hospital Informatization / Solution Research and Bid Support",
      preview: "Supported research, proposal optimization, and bidding materials for smart healthcare solutions.",
      sections: [
        { title: "Experience Overview", paragraphs: ["During this internship, I supported research, solution optimization, and bid preparation for smart healthcare projects. The work covered hospital information-system needs, industry and competitor research, business suggestions, and proposal material organization."] },
        { title: "Work", paragraphs: ["I completed 5+ competitor and industry analyses, comparing vendors across hospital informatization, system integration, business-process optimization, and data management.", "I organized requirements from 5+ hospitals and converted scattered interview notes into structured records around efficiency, system collaboration, information management, and service experience.", "Based on the research, I helped form 3 practical business optimization suggestions, supported IIH-related solution iteration and bidding work, helped 2 projects enter the bidding stage, improved proposal review scores by 15%, and raised market-positioning judgment accuracy to 95%."] },
        { title: "Capability Highlights", bullets: ["Understanding real customer scenarios from hospital interviews and requirement materials.", "Comparing industry and competitor solutions by coverage, value, and implementation path.", "Turning research findings into practical solution suggestions.", "Structuring proposal materials so reviewers can understand and compare the logic.", "Connecting business needs with technical solution expression."] },
        { title: "Reflection", paragraphs: ["This experience clarified the core of solution work for me: understand the client business first, define the problem, then organize the solution."] }
      ]
    }
  },
  {
    id: "student-union",
    date: "2021.08 - 2024.04",
    tags: ["Team Management", "Event Operations", "Budget", "Cross-functional Coordination"],
    zh: {
      title: "北京建筑大学电信学院学生会",
      role: "学生会主席",
      direction: "团队管理 / 活动运营 / 跨部门协作",
      preview: "负责学生组织整体统筹、活动策划、人员协调和资源管理，长期处于多任务、多角色、多节点协作环境中。",
      sections: [
        { title: "经历概览", paragraphs: ["在担任北京建筑大学电信学院学生会主席期间，我负责学生组织的整体统筹、活动策划、人员协调和资源管理。学生会工作覆盖年度活动排期、团队分工、预算管理、现场执行、外部沟通和活动复盘。", "这段经历虽然不是企业项目，但它让我长期处在多任务、多角色、多节点协作的环境中，也锻炼了我把模糊目标拆解成可执行计划的能力。"] },
        { title: "工作内容", paragraphs: ["任职期间，我统筹 **20+ 名志愿者与学生干部**，负责年度活动安排、人员分工、执行节奏和现场协调。全年主导策划并执行 **10+ 场大型校内外活动**，包括迎新晚会、宣讲会、主题文化节等。", "在活动筹备阶段，我负责活动主题设定、流程设计、宣传物料准备、人员排班和场地协调。执行过程中，需要持续跟进各小组进度，处理现场突发情况，并保障老师、学生干部、志愿者和合作方之间的信息同步。", "在资源管理方面，我主动联系企业及校内合作单位，累计争取 **1w+ 元活动经费及物资赞助**，并对预算、采购、物资发放和使用记录进行跟踪管理。活动结束后，我会整理分工表、时间线、物资清单和复盘材料，用于后续活动复用。"] },
        { title: "关键能力亮点", bullets: ["**活动从 0 到 1 的组织能力**：能够从活动目标出发，完成主题设定、流程设计、资源准备、人员分工和现场执行。", "**多角色沟通协调**：活动执行涉及老师、学生干部、志愿者、企业合作方和校内单位，需要在不同角色之间同步信息、协调资源和解决冲突。", "**预算与资源管理**：通过赞助沟通、预算记录、采购管理和物资发放跟踪，保证活动资源使用透明可控。", "**现场执行与风险响应**：活动当天需要处理流程延误、人员变动、物资缺失和突发情况，提前准备时间线、分工表和风险预案能够提升团队响应效率。", "**复盘与流程沉淀**：活动结束后整理复盘材料，将经验、问题和资源清单沉淀下来，提高后续活动执行效率。"] },
        { title: "经验沉淀", paragraphs: ["学生会经历让我形成了较强的组织和推进意识。很多大型活动并不是靠临场发挥完成，而是依赖前期计划、清晰分工、过程跟进和复盘沉淀。这种工作方式也迁移到了我后续的软件项目、测试交付和团队协作中。"] }
      ]
    },
    en: {
      title: "Student Union, School of Electrical and Information Engineering",
      role: "Student Union President",
      direction: "Team Management / Event Operations / Cross-functional Coordination",
      preview: "Led student-organization planning, event operations, people coordination, and resource management across multi-task and multi-stakeholder environments.",
      sections: [
        { title: "Experience Overview", paragraphs: ["As Student Union President, I coordinated organization-wide planning, event design, people coordination, and resource management. The work covered annual schedules, team division, budget control, on-site execution, external communication, and post-event reviews.", "Although this was not an enterprise project, it trained me to convert ambiguous goals into executable plans across multiple roles and timelines."] },
        { title: "Work", paragraphs: ["I coordinated 20+ volunteers and student leaders, managed annual events, team assignments, execution rhythm, and on-site coordination, and led 10+ large campus and external events including welcome parties, seminars, and cultural festivals.", "During preparation, I handled theme setting, process design, promotion materials, staffing, and venue coordination. During execution, I tracked group progress, handled unexpected issues, and kept teachers, student leaders, volunteers, and partners aligned.", "For resources, I contacted enterprises and campus partners, secured 10k+ RMB in funding and material sponsorship, and tracked budget, purchasing, distribution, and usage records. After events, I organized role lists, timelines, material inventories, and review notes for future reuse."] },
        { title: "Capability Highlights", bullets: ["Organizing events from zero to one.", "Coordinating communication among teachers, student leaders, volunteers, enterprise partners, and campus units.", "Managing budget, sponsorship, purchasing, and material distribution transparently.", "Responding to on-site risks with timelines, role sheets, and contingency plans.", "Turning post-event reviews into reusable process assets."] },
        { title: "Reflection", paragraphs: ["This experience built my organizational and execution mindset. Large events depend on planning, clear responsibility, process tracking, and review, not just on-the-spot improvisation."] }
      ]
    }
  }
];

function getStoredLanguage() {
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return stored === "en" || stored === "zh" ? stored : "zh";
}

let currentLanguage = getStoredLanguage();

function translate(key) {
  return SITE_COPY[currentLanguage]?.[key] ?? SITE_COPY.zh[key] ?? "";
}

function applyStaticTranslations() {
  document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "en";
  document.body.dataset.lang = currentLanguage;

  const page = document.body.dataset.page || "home";
  const title = PAGE_META[page]?.[currentLanguage];
  if (title) document.title = title;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = translate(element.dataset.i18n);
    if (value) element.textContent = value;
  });

  document.querySelectorAll("[data-i18n-html]").forEach((element) => {
    const value = translate(element.dataset.i18nHtml);
    if (value) element.innerHTML = value;
  });

  document.querySelectorAll("[data-lang-switch]").forEach((button) => {
    const active = button.dataset.langSwitch === currentLanguage;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function setLanguage(language) {
  if (language !== "zh" && language !== "en") return;
  currentLanguage = language;
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  applyStaticTranslations();
  renderProjectCards();
  renderExperienceCards();
}

function initLanguageSwitch() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-lang-switch]");
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    setLanguage(button.dataset.langSwitch);
  }, { capture: true });
  applyStaticTranslations();
}

window.setPortfolioLanguage = setLanguage;

function getLocalizedProject(project) {
  if (currentLanguage === "zh") return project;
  const copy = PROJECT_COPY_EN[project.id];
  if (!copy) return project;

  const sections = project.sections.map((section) => {
    const sectionCopy = copy.sections?.[section.key] || {};
    return {
      ...section,
      ...sectionCopy,
      tab: sectionCopy.tab || PROJECT_SECTION_TABS_EN[section.key] || section.tab,
      paragraphs: sectionCopy.paragraphs || [],
      bullets: sectionCopy.bullets || [],
      ordered: sectionCopy.ordered || []
    };
  });

  return {
    ...project,
    ...copy,
    sections
  };
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderInline(value) {
  return escapeHTML(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function renderParagraphs(paragraphs = []) {
  return paragraphs.map((paragraph) => `<p>${renderInline(paragraph)}</p>`).join("");
}

function renderList(items = [], ordered = false) {
  if (!items.length) return "";
  const tag = ordered ? "ol" : "ul";
  return `<${tag}>${items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</${tag}>`;
}

function getProject(projectId) {
  const project = projects.find((item) => item.id === projectId);
  return project ? getLocalizedProject(project) : undefined;
}

function createProjectDetail(project) {
  return `
    <div class="detail-header">
      <div>
        <h3>${escapeHTML(project.title)}</h3>
        <p class="detail-subtitle">${escapeHTML(project.direction)}</p>
      </div>
      <button class="detail-close" type="button" aria-label="Close ${escapeHTML(project.title)} detail" data-close-project="${project.id}">×</button>
    </div>
    <div class="detail-body">
      <div class="detail-media">
        <img src="${project.cover}" alt="${escapeHTML(project.title)} visual evidence" loading="lazy" />
        <div class="result-grid">
          ${project.stats.map(([label, value]) => `
            <div class="result-chip">
              <span>${escapeHTML(label)}</span>
              <strong>${escapeHTML(value)}</strong>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="workflow-rail">
        ${project.workflow.map((item) => `<span>${escapeHTML(item)}</span>`).join("")}
      </div>
      <div class="detail-tabs">
        ${project.sections.map((section) => `<button type="button" data-detail-scroll="${project.id}-${section.key}">${escapeHTML(section.tab)}</button>`).join("")}
      </div>
      ${project.sections.map((section) => `
        <section class="detail-section" id="detail-${project.id}-${section.key}">
          <h4>${escapeHTML(section.title)}</h4>
          ${renderParagraphs(section.paragraphs)}
          ${renderList(section.ordered, true)}
          ${renderList(section.bullets)}
        </section>
      `).join("")}
    </div>
  `;
}

function renderProjectCards() {
  const list = document.getElementById("project-list");
  if (!list) return;
  const openIds = [...list.querySelectorAll(".project-accordion.is-open")]
    .map((card) => card.dataset.projectCard)
    .filter(Boolean);
  const localizedProjects = projects.map(getLocalizedProject);

  list.innerHTML = localizedProjects.map((project) => `
    <article class="project-accordion" data-project-card="${project.id}">
      <button class="project-summary-card interactive-card" type="button" aria-expanded="false" aria-controls="project-detail-${project.id}" data-project-toggle="${project.id}">
        <span class="project-thumb">
          <img src="${project.cover}" alt="${escapeHTML(project.title)} cover" loading="lazy" />
          <span class="project-index">${project.index}</span>
        </span>
        <span class="project-copy">
          <h3>${escapeHTML(project.title)}</h3>
          <span class="project-direction">${escapeHTML(project.direction)}</span>
          <span class="project-summary">${escapeHTML(project.summary)}</span>
          <span class="tag-row">${project.tags.slice(0, 6).map((tag) => `<span>${escapeHTML(tag)}</span>`).join("")}</span>
        </span>
        <span class="open-detail" aria-hidden="true">↗</span>
      </button>
      <div class="project-inline-detail interactive-card" id="project-detail-${project.id}" aria-hidden="true" hidden>
        ${createProjectDetail(project)}
      </div>
    </article>
  `).join("");

  list.querySelectorAll("[data-project-toggle]").forEach((button) => {
    button.addEventListener("click", () => toggleProject(button.dataset.projectToggle, true));
  });

  list.querySelectorAll("[data-close-project]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      closeProject(button.dataset.closeProject, true);
    });
  });

  list.querySelectorAll("[data-detail-scroll]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(`detail-${button.dataset.detailScroll}`);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  bindSpotlight(list.querySelectorAll(".interactive-card"));
  openIds.forEach((projectId) => openProject(projectId, false));
}

function openProject(projectId, shouldScroll = false) {
  const card = document.querySelector(`[data-project-card="${CSS.escape(projectId)}"]`);
  const button = document.querySelector(`[data-project-toggle="${CSS.escape(projectId)}"]`);
  const detail = document.getElementById(`project-detail-${projectId}`);
  if (!card || !button || !detail) return;

  detail.hidden = false;
  detail.setAttribute("aria-hidden", "false");
  card.classList.add("is-open");
  button.setAttribute("aria-expanded", "true");

  if (shouldScroll) {
    window.requestAnimationFrame(() => {
      card.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

function closeProject(projectId, shouldScroll = false) {
  const card = document.querySelector(`[data-project-card="${CSS.escape(projectId)}"]`);
  const button = document.querySelector(`[data-project-toggle="${CSS.escape(projectId)}"]`);
  const detail = document.getElementById(`project-detail-${projectId}`);
  if (!card || !button || !detail) return;

  card.classList.remove("is-open");
  button.setAttribute("aria-expanded", "false");
  detail.setAttribute("aria-hidden", "true");

  window.setTimeout(() => {
    if (!card.classList.contains("is-open")) detail.hidden = true;
  }, 760);

  if (shouldScroll) {
    button.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function toggleProject(projectId, shouldScroll = false) {
  const card = document.querySelector(`[data-project-card="${CSS.escape(projectId)}"]`);
  if (!card) return;
  if (card.classList.contains("is-open")) closeProject(projectId, shouldScroll);
  else openProject(projectId, shouldScroll);
}

function getLocalizedExperience(item) {
  return {
    id: item.id,
    date: item.date,
    tags: item.tags,
    ...(item[currentLanguage] || item.zh)
  };
}

function renderExperienceCards() {
  const list = document.getElementById("experience-list");
  if (!list) return;
  const openIds = [...list.querySelectorAll(".experience-accordion.is-open")]
    .map((card) => card.dataset.experienceCard)
    .filter(Boolean);
  const localized = EXPERIENCE_DATA.map(getLocalizedExperience);

  list.innerHTML = localized.map((item) => `
    <article class="experience-accordion" data-experience-card="${item.id}">
      <button class="experience-summary-card interactive-card" type="button" aria-expanded="false" aria-controls="experience-detail-${item.id}" data-experience-toggle="${item.id}">
        <span class="experience-date">${escapeHTML(item.date)}</span>
        <span class="experience-copy">
          <h2>${escapeHTML(item.title)}</h2>
          <span class="experience-role">${escapeHTML(item.role)}</span>
          <span class="experience-direction">${escapeHTML(item.direction)}</span>
          <span class="experience-preview">${escapeHTML(item.preview)}</span>
          <span class="tag-row">${item.tags.map((tag) => `<span>${escapeHTML(tag)}</span>`).join("")}</span>
        </span>
        <span class="open-detail" aria-hidden="true">↗</span>
      </button>
      <div class="experience-inline-detail interactive-card" id="experience-detail-${item.id}" aria-hidden="true" hidden>
        ${item.sections.map((section) => `
          <section class="detail-section">
            <h4>${escapeHTML(section.title)}</h4>
            ${renderParagraphs(section.paragraphs)}
            ${renderList(section.bullets)}
          </section>
        `).join("")}
      </div>
    </article>
  `).join("");

  list.querySelectorAll("[data-experience-toggle]").forEach((button) => {
    button.addEventListener("click", () => toggleExperience(button.dataset.experienceToggle, true));
  });

  bindSpotlight(list.querySelectorAll(".interactive-card"));
  openIds.forEach((id) => openExperience(id, false));
}

function openExperience(id, shouldScroll = false) {
  const card = document.querySelector(`[data-experience-card="${CSS.escape(id)}"]`);
  const button = document.querySelector(`[data-experience-toggle="${CSS.escape(id)}"]`);
  const detail = document.getElementById(`experience-detail-${id}`);
  if (!card || !button || !detail) return;

  detail.hidden = false;
  detail.setAttribute("aria-hidden", "false");
  card.classList.add("is-open");
  button.setAttribute("aria-expanded", "true");
  if (shouldScroll) {
    window.requestAnimationFrame(() => card.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
}

function closeExperience(id, shouldScroll = false) {
  const card = document.querySelector(`[data-experience-card="${CSS.escape(id)}"]`);
  const button = document.querySelector(`[data-experience-toggle="${CSS.escape(id)}"]`);
  const detail = document.getElementById(`experience-detail-${id}`);
  if (!card || !button || !detail) return;

  card.classList.remove("is-open");
  button.setAttribute("aria-expanded", "false");
  detail.setAttribute("aria-hidden", "true");
  window.setTimeout(() => {
    if (!card.classList.contains("is-open")) detail.hidden = true;
  }, 760);
  if (shouldScroll) button.scrollIntoView({ behavior: "smooth", block: "center" });
}

function toggleExperience(id, shouldScroll = false) {
  const card = document.querySelector(`[data-experience-card="${CSS.escape(id)}"]`);
  if (!card) return;
  if (card.classList.contains("is-open")) closeExperience(id, shouldScroll);
  else openExperience(id, shouldScroll);
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px 8% 0px", threshold: 0.01 }
  );

  items.forEach((item) => observer.observe(item));
}

function bindSpotlight(elements) {
  elements.forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      element.style.setProperty("--mx", `${x}%`);
      element.style.setProperty("--my", `${y}%`);
    });
  });
}

function initMagnetic() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  document.querySelectorAll(".magnetic").forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) / 10;
      const y = (event.clientY - rect.top - rect.height / 2) / 10;
      element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });

    element.addEventListener("pointerleave", () => {
      element.style.transform = "";
    });
  });
}

function runPageTransition(callback = () => {}) {
  const transition = document.getElementById("page-transition");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!transition || reduceMotion) {
    callback();
    return;
  }

  transition.classList.remove("is-active", "is-arriving");
  void transition.offsetWidth;
  transition.classList.add("is-active");
  window.setTimeout(callback, 310);
  window.setTimeout(() => transition.classList.remove("is-active"), 820);
}

function initPageLoadTransition() {
  const transition = document.getElementById("page-transition");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!transition || reduceMotion) return;

  if (window.sessionStorage.getItem("site-page-transition") === "1") {
    window.sessionStorage.removeItem("site-page-transition");
    transition.classList.remove("is-active");
    void transition.offsetWidth;
    transition.classList.add("is-arriving");
    window.setTimeout(() => transition.classList.remove("is-arriving"), 760);
  }
}

function closeMobileMenu() {
  const button = document.querySelector(".mobile-menu-button");
  const menu = document.querySelector(".mobile-menu-popover");
  if (!button || !menu) return;
  button.classList.remove("is-open");
  button.setAttribute("aria-expanded", "false");
  menu.classList.remove("is-open");
  menu.setAttribute("aria-hidden", "true");
}

function initMobileMenu() {
  const button = document.querySelector(".mobile-menu-button");
  const menu = document.querySelector(".mobile-menu-popover");
  if (!button || !menu) return;

  button.addEventListener("click", () => {
    const open = !button.classList.contains("is-open");
    button.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", String(!open));
  });
}

function navigateToHash(hash, projectId) {
  const target = document.querySelector(hash);
  if (!target) {
    if (projectId) {
      window.sessionStorage.setItem("pending-project", projectId);
      runPageTransition(() => {
        window.sessionStorage.setItem("site-page-transition", "1");
        window.location.href = `index.html${hash}`;
      });
    }
    return;
  }

  runPageTransition(() => {
    closeMobileMenu();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    if (projectId) {
      window.setTimeout(() => openProject(projectId, true), 360);
    }
  });
}

function initPageLinks() {
  document.querySelectorAll("[data-jump-project]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      navigateToHash("#projects", link.dataset.jumpProject);
    }, { capture: true });
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      const target = hash ? document.querySelector(hash) : null;
      if (!target) return;
      event.preventDefault();
      navigateToHash(hash, link.dataset.jumpProject);
    });
  });

  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    if (link.target && link.target !== "_self") return;

    let url;
    try {
      url = new URL(href, window.location.href);
    } catch {
      return;
    }

    if (url.origin !== window.location.origin) return;

    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      runPageTransition(() => {
        closeMobileMenu();
        window.sessionStorage.setItem("site-page-transition", "1");
        window.location.href = url.href;
      });
    });
  });
}

function initPendingProject() {
  const pendingProject = window.sessionStorage.getItem("pending-project");
  if (!pendingProject) return;
  window.sessionStorage.removeItem("pending-project");
  if (!document.getElementById("projects") && !document.getElementById("project-list")) return;
  window.setTimeout(() => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
    openProject(pendingProject, true);
  }, 560);
}

function initActiveNav() {
  const links = [...document.querySelectorAll(".pill[href^='#']")];
  const sections = links
    .map((link) => ({ link, section: document.querySelector(link.getAttribute("href")) }))
    .filter((item) => item.section);

  function update() {
    const y = window.scrollY + window.innerHeight * 0.32;
    let active = sections[0];
    sections.forEach((item) => {
      if (item.section.offsetTop <= y) active = item;
    });
    links.forEach((link) => link.classList.toggle("is-active", link === active.link));
  }

  update();
  window.addEventListener("scroll", update, { passive: true });
}

function initCursorSignal() {
  const signal = document.getElementById("cursor-signal");
  if (!signal || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  window.addEventListener("pointermove", (event) => {
    signal.classList.add("is-active");
    signal.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
  }, { passive: true });

  window.addEventListener("pointerleave", () => {
    signal.classList.remove("is-active");
  });
}

function initCaseOrbit() {
  const orbit = document.querySelector("[data-case-orbit]");
  if (!orbit) return;

  const discs = [...orbit.querySelectorAll(".case-disc")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let angle = -0.25;
  let velocity = 0.0028;
  let dragging = false;
  let dragged = false;
  let hovering = false;
  let lastX = 0;
  let rafId = 0;

  function layout() {
    const rect = orbit.getBoundingClientRect();
    const radiusX = Math.max(170, rect.width * 0.41);
    const radiusY = Math.max(136, rect.height * 0.36);
    discs.forEach((disc, index) => {
      const theta = angle + (index / discs.length) * Math.PI * 2;
      const depth = (Math.sin(theta) + 1) / 2;
      const x = Math.cos(theta) * radiusX;
      const y = Math.sin(theta) * radiusY * 0.82;
      const scale = 0.64 + depth * 0.3;
      const opacity = 0.52 + depth * 0.48;
      disc.style.zIndex = String(Math.round(10 + depth * 30));
      disc.style.opacity = opacity.toFixed(3);
      disc.style.filter = `saturate(${0.78 + depth * 0.32}) blur(${(1 - depth) * 0.5}px)`;
      disc.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${depth * 140}px) scale(${scale}) rotate(${Math.cos(theta) * 5}deg)`;
    });
  }

  function tick() {
    if (!reduceMotion && !dragging && !hovering) {
      angle += velocity;
      velocity += (0.0028 - velocity) * 0.018;
    }
    layout();
    rafId = window.requestAnimationFrame(tick);
  }

  orbit.addEventListener("pointerdown", (event) => {
    dragging = true;
    dragged = false;
    lastX = event.clientX;
    orbit.classList.add("is-dragging");
    orbit.setPointerCapture?.(event.pointerId);
  });

  orbit.addEventListener("pointerenter", () => {
    hovering = true;
  });

  orbit.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const delta = event.clientX - lastX;
    if (Math.abs(delta) > 2) dragged = true;
    angle += delta * 0.006;
    velocity = delta * 0.0006;
    lastX = event.clientX;
    layout();
  });

  function endDrag(event) {
    if (!dragging) return;
    dragging = false;
    orbit.classList.remove("is-dragging");
    orbit.releasePointerCapture?.(event.pointerId);
    window.setTimeout(() => {
      dragged = false;
    }, 0);
  }

  orbit.addEventListener("pointerup", endDrag);
  orbit.addEventListener("pointercancel", endDrag);
  orbit.addEventListener("pointerleave", (event) => {
    hovering = false;
    endDrag(event);
  });

  discs.forEach((disc) => {
    disc.addEventListener("click", (event) => {
      if (dragged) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      navigateToHash("#projects", disc.dataset.jumpProject);
    });
  });

  layout();
  tick();

  window.addEventListener("resize", layout, { passive: true });
  window.addEventListener("pagehide", () => {
    if (rafId) window.cancelAnimationFrame(rafId);
  });
}

function initCircularGallery() {
  const stage = document.querySelector("[data-circular-gallery]");
  if (!stage) return;

  const items = [...stage.querySelectorAll(".circular-gallery-item")];
  if (!items.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let target = 0;
  let current = 0;
  let dragging = false;
  let dragged = false;
  let lastX = 0;
  let rafId = 0;

  function layout() {
    const rect = stage.getBoundingClientRect();
    const radiusX = Math.min(Math.max(rect.width * 0.34, 210), 560);
    const radiusY = Math.min(Math.max(rect.height * 0.16, 62), 135);
    items.forEach((item, index) => {
      const theta = current + (index / items.length) * Math.PI * 2;
      const x = Math.sin(theta) * radiusX;
      const y = -Math.cos(theta) * radiusY;
      const depth = (Math.cos(theta) + 1) / 2;
      const scale = 0.52 + depth * 0.58;
      const opacity = 0.22 + depth * 0.78;
      const rotateY = -Math.sin(theta) * 18;
      const rotateZ = Math.sin(theta) * 4;

      item.style.zIndex = String(Math.round(depth * 100));
      item.style.opacity = opacity.toFixed(3);
      item.style.filter = `saturate(${0.72 + depth * 0.42}) blur(${(1 - depth) * 1.1}px)`;
      item.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) scale(${scale}) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
    });
  }

  function tick() {
    if (!dragging && !reduceMotion) {
      target += 0.0032;
    }
    current += (target - current) * 0.065;
    layout();
    rafId = window.requestAnimationFrame(tick);
  }

  function selectItem(item, index) {
    const theta = current + (index / items.length) * Math.PI * 2;
    target -= theta;
    items.forEach((candidate) => candidate.classList.remove("is-selected"));
    item.classList.add("is-selected");
    window.setTimeout(() => item.classList.remove("is-selected"), 900);
  }

  function getFrontItem() {
    return items.reduce((front, item) => {
      const frontDepth = Number.parseInt(front.style.zIndex || "0", 10);
      const itemDepth = Number.parseInt(item.style.zIndex || "0", 10);
      return itemDepth > frontDepth ? item : front;
    }, items[0]);
  }

  stage.addEventListener("pointerdown", (event) => {
    dragging = true;
    dragged = false;
    lastX = event.clientX;
    stage.classList.add("is-dragging");
    stage.setPointerCapture?.(event.pointerId);
  });

  stage.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const delta = event.clientX - lastX;
    if (Math.abs(delta) > 2) dragged = true;
    target += delta * 0.006;
    lastX = event.clientX;
  });

  function endDrag(event) {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove("is-dragging");
    stage.releasePointerCapture?.(event.pointerId);
    window.setTimeout(() => {
      dragged = false;
    }, 0);
  }

  stage.addEventListener("pointerup", (event) => {
    const wasDragged = dragged;
    const item = event.target.closest(".circular-gallery-item") || getFrontItem();
    const index = item ? items.indexOf(item) : -1;
    endDrag(event);
    if (!wasDragged && item && index >= 0) {
      event.preventDefault();
      selectItem(item, index);
    }
  });
  stage.addEventListener("pointercancel", endDrag);
  stage.addEventListener("pointerleave", endDrag);
  stage.addEventListener("wheel", (event) => {
    event.preventDefault();
    target += event.deltaY * 0.0022;
  }, { passive: false });

  items.forEach((item, index) => {
    item.addEventListener("click", (event) => {
      if (dragged) return;
      event.preventDefault();
      selectItem(item, index);
    });
  });

  window.addEventListener("resize", layout, { passive: true });
  layout();
  tick();

  window.addEventListener("pagehide", () => {
    if (rafId) window.cancelAnimationFrame(rafId);
  });
}

function initNeuralCanvas() {
  const canvas = document.getElementById("neural-canvas");
  if (!canvas) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const mouse = { x: -9999, y: -9999, active: false };
  let width = 0;
  let height = 0;
  let particles = [];
  let rafId = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = width < 700 ? 54 : 118;
    particles = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * (0.42 + (index % 5) * 0.025),
      vy: (Math.random() - 0.5) * (0.42 + (index % 7) * 0.02),
      size: 1.1 + Math.random() * 2.4,
      hue: index % 3 === 0 ? 197 : index % 3 === 1 ? 268 : 31,
      phase: Math.random() * Math.PI * 2
    }));
  }

  function draw(time = 0) {
    ctx.clearRect(0, 0, width, height);
    const pulse = Math.sin(time * 0.0014) * 0.5 + 0.5;

    particles.forEach((particle) => {
      if (!reduceMotion) {
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distance = Math.hypot(dx, dy);
        if (mouse.active && distance < 210 && distance > 0.01) {
          const force = (1 - distance / 210) * 0.018;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.992;
        particle.vy *= 0.992;
        if (particle.x < -30) particle.x = width + 30;
        if (particle.x > width + 30) particle.x = -30;
        if (particle.y < -30) particle.y = height + 30;
        if (particle.y > height + 30) particle.y = -30;
      }
    });

    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const a = particles[i];
        const b = particles[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance > 142) continue;
        const alpha = (1 - distance / 142) * (0.22 + pulse * 0.08);
        ctx.strokeStyle = `hsla(${a.hue}, 90%, 70%, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    particles.forEach((particle) => {
      const mouseDistance = Math.hypot(particle.x - mouse.x, particle.y - mouse.y);
      const glow = mouse.active && mouseDistance < 230 ? 0.95 : 0.42 + Math.sin(time * 0.001 + particle.phase) * 0.18;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${particle.hue}, 96%, 72%, ${Math.max(0.22, glow)})`;
      ctx.fill();
    });

    if (mouse.active) {
      const nearby = particles
        .map((particle) => ({ particle, distance: Math.hypot(particle.x - mouse.x, particle.y - mouse.y) }))
        .filter((item) => item.distance < 260)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 14);

      nearby.forEach(({ particle, distance }) => {
        const alpha = (1 - distance / 260) * 0.42;
        ctx.strokeStyle = `rgba(125, 215, 255, ${alpha})`;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(particle.x, particle.y);
        ctx.stroke();
      });

      const radius = 34 + pulse * 18;
      const ring = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, radius * 2.2);
      ring.addColorStop(0, "rgba(125, 215, 255, 0.18)");
      ring.addColorStop(0.5, "rgba(138, 92, 255, 0.08)");
      ring.addColorStop(1, "rgba(125, 215, 255, 0)");
      ctx.fillStyle = ring;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, radius * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!reduceMotion) rafId = window.requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pointermove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    mouse.active = true;
  }, { passive: true });
  window.addEventListener("pointerleave", () => {
    mouse.active = false;
  });

  resize();
  draw();

  window.addEventListener("pagehide", () => {
    if (rafId) window.cancelAnimationFrame(rafId);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initPageLoadTransition();
  initNeuralCanvas();
  initLanguageSwitch();
  renderProjectCards();
  renderExperienceCards();
  initReveal();
  bindSpotlight(document.querySelectorAll(".interactive-card"));
  initMagnetic();
  initMobileMenu();
  initPageLinks();
  initActiveNav();
  initCursorSignal();
  initCaseOrbit();
  initCircularGallery();
  initPendingProject();
});
