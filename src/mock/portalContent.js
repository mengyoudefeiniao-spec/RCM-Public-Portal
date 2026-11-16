const t = (zh, en, ar, ckb) => ({ zh, en, ar, ckb })

export const PORTAL_KEY_PREFIX = 'rcm_portal_'

export const portalSeedRecords = [
  {
    key: 'rcm_portal_site_v1',
    value: {
      brand: t('国家电子配给卡公共服务门户', 'National E-Ration Card Public Portal', 'البوابة الوطنية لخدمة البطاقة التموينية الإلكترونية', 'پۆرتالی نیشتمانی خزمەتگوزاری کارتی سەهمەتی ئەلیکترۆنی'),
      authority: t('伊拉克贸易部', 'Ministry of Trade, Iraq', 'وزارة التجارة العراقية', 'وەزارەتی بازرگانی عێراق'),
      footerNote: t('国家食品保障与配给数字化服务', 'National food security and digital ration service', 'الأمن الغذائي الوطني وخدمة التموين الرقمية', 'ئاسایشی خۆراکی نیشتمانی و خزمەتگوزاری سەهمەتی دیجیتال'),
      contact: t('服务热线：800 1234', 'Hotline: 800 1234', 'خط الخدمة: 800 1234', 'هێڵی خزمەتگوزاری: 800 1234')
    }
  },
  {
    key: 'rcm_portal_hero_v1',
    value: {
      badge: t('便捷 · 透明 · 可信', 'Simple · Transparent · Trusted', 'سهل · شفاف · موثوق', 'ئاسان · ڕوون · متمانەپێکراو'),
      eyebrow: t('电子配给卡服务', 'E-Ration Card Service', 'خدمة البطاقة التموينية الإلكترونية', 'خزمەتگوزاری کارتی سەهمەتی ئەلیکترۆنی'),
      title: t('从手机开始，轻松办理每一笔配给业务', 'Start every ration service right from your phone', 'ابدأ بمعاملتك الاَن وبسهولة بإستخدام هاتفك المحمول', 'ئێستا بە ئاسانی لە مۆبایلەکەتەوە دەست بە داواکاری بکە'),
      description: t('在线提交申请、追踪办理进度、查询每月配额，所有信息一处掌握。', 'Submit applications, track progress and check your monthly quota, all in one place.', 'قدّم طلبك وتابع حالته واعرف حصتك الشهرية في مكان واحد.', 'داواکاری پێشکەش بکە و دۆخی بزانە و سەهمەتی مانگانەت لە یەک شوێنەوە ببینە.'),
      primaryCta: t('立即开始办理', 'Start now', 'إبدأ معاملتك الآن', 'ئێستا دەست بکە'),
      secondaryCta: t('查看使用指南', 'View guide', 'اطّلع على الدليل', 'ڕێنمایی ببینە')
    }
  },
  {
    key: 'rcm_portal_about_v1',
    value: {
      title: t('关于电子配给卡项目', 'About the E-Ration Card project', 'نبذة عن البطاقة التموينية الإلكترونية', 'دەربارەی پرۆژەی کارتی سەهمەتی ئەلیکترۆنی'),
      body: t('电子配给卡项目旨在将传统纸质配给卡升级为数字化服务，为公民与代销网点提供统一的线上办理渠道。家庭建档、信息变更、配给申领与现场核销均可在一个平台完成，让每一个受益家庭都能及时、准确地获得国家配给物资。', 'The project replaces paper ration books with a digital service, giving citizens and agent outlets one unified channel. Family registration, updates, monthly claims and in-store verification are completed on a single platform so every beneficiary household receives its ration accurately and on time.', 'يهدف مشروع البطاقة التموينية الإلكترونية إلى تحويل البطاقة الورقية إلى خدمة رقمية موحّدة للمواطنين ووكلاء التموين. يمكن إتمام تسجيل الأسرة وتعديل البيانات وطلب الحصة والتحقق في الموقع عبر منصة واحدة.', 'پرۆژەکە کارتی کاغەزی دەگۆڕێت بە خزمەتگوزارییەکی دیجیتالی یەکگرتوو بۆ هاوڵاتیان و بنکەکانی تەدارکات. تۆمارکردنی خێزان، گۆڕینی زانیاری، داواکاری سەهمەت و پشتڕاستکردنەوە لە شوێنێکدا ئەنجام دەدرێن.'),
      statHouseholds: '12.4M',
      statAgencies: '7',
      statCoverage: '100%'
    }
  },
  {
    key: 'rcm_portal_news_001',
    value: {
      date: '2026-11-12',
      sort: 1,
      visible: true,
      category: t('通知公告', 'Announcement', 'إعلان', 'ئاگاداری'),
      title: t('电子配给卡在线登记通道全面开放', 'Online registration for the e-ration card is now open', 'تم فتح باب التسجيل الإلكتروني للبطاقة التموينية', 'دەرگای تۆمارکردنی ئەلیکترۆنی کرایەوە'),
      summary: t('符合条件的家庭可通过公民端应用提交资料，系统将自动校验身份与家庭关系。', 'Eligible households can submit documents through the citizen app; identity and family links are verified automatically.', 'يمكن للعائلات المؤهلة تقديم المستندات عبر تطبيق المواطن، وتتحقق المنصة من الهوية والصلة العائلية تلقائيًا.', 'خێزانە شایستەکان دەتوانن لە ڕێگەی ئەپی هاوڵاتیەوە بەڵگەنامەکان پێشکەش بکەن و سیستەم بە ئۆتۆماتیکی ناسنامە و پەیوەندیی خێزان دەپشکنێت.'),
      cover: ''
    }
  },
  {
    key: 'rcm_portal_news_002',
    value: {
      date: '2026-11-08',
      sort: 2,
      visible: true,
      category: t('服务动态', 'Service update', 'تحديث الخدمة', 'نوێکردنەوەی خزمەتگوزاری'),
      title: t('十一月配给品发放安排已发布', 'November ration distribution schedule published', 'نُشر جدول توزيع حصص شهر تشرين الثاني', 'خشتەی دابەشکردنی سەهمەتی مانگی تشرینی دووەم بڵاوکرایەوە'),
      summary: t('本月配给品可按区域查询领取时间与指定代理网点，请提前确认登记手机号。', 'Check pickup times and designated agent outlets by region, and confirm your registered phone number in advance.', 'يمكن الاستعلام عن موعد الاستلام ونقطة التوريد حسب المنطقة؛ يرجى تأكيد رقم الهاتف المسجل مسبقًا.', 'دەتوانیت کاتی وەرگرتن و بنکەی تەدارکات بەپێی ناوچە ببینیت؛ تکایە پێشتر ژمارەی تەلەفۆنی تۆمارکراوت پشتڕاست بکەرەوە.'),
      cover: ''
    }
  },
  {
    key: 'rcm_portal_news_003',
    value: {
      date: '2026-11-03',
      sort: 3,
      visible: true,
      category: t('业务提醒', 'Reminder', 'تنبيه', 'ئاگاداری'),
      title: t('部分代理网点服务时间临时调整', 'Temporary service hour changes at selected agent outlets', 'تغيير مؤقت في أوقات عمل بعض وكلاء التموين', 'گۆڕینی کاتیی کاتەکانی هەندێک بنکەی تەدارکات'),
      summary: t('受节假日影响，部分网点营业时间有所调整，出行前请在应用中确认最新信息。', 'Some outlets have adjusted hours for the holiday. Confirm the latest information in the app before visiting.', 'بسبب العطلة، تغيّرت أوقات عمل بعض النقاط؛ يُرجى التأكد من التطبيق قبل الزيارة.', 'بەهۆی جەژنەوە کاتی هەندێک بنکە گۆڕاوە؛ پێش ڕۆیشتن لە ئەپەکەدا دڵنیا بەرەوە.'),
      cover: ''
    }
  },
  {
    key: 'rcm_portal_news_004',
    value: {
      date: '2026-10-28',
      sort: 4,
      visible: true,
      category: t('安全提示', 'Security', 'سلامة', 'ئاسایش'),
      title: t('关于防范虚假配给卡短信的提醒', 'Beware of fraudulent ration card messages', 'تنبيه من رسائل البطاقة التموينية الاحتيالية', 'ئاگاداری لە نامە ساختەکانی کارتی سەهمەت'),
      summary: t('官方平台不会通过短信索取密码或验证码，请勿点击来源不明的链接。', 'The official platform never asks for passwords or codes by SMS. Do not open unknown links.', 'لا تطلب المنصة الرسمية كلمات المرور أو رموز التحقق عبر الرسائل النصية.', 'پلاتفۆرمی فەرمی هەرگیز لە ڕێگەی نامەوە داوای تێپەڕوشە یان کۆد ناکات.'),
      cover: ''
    }
  },
  {
    key: 'rcm_portal_video_001',
    value: {
      sort: 1,
      visible: true,
      duration: '03:20',
      title: t('如何注册电子配给卡', 'How to register for an e-ration card', 'كيفية التسجيل في البطاقة التموينية الإلكترونية', 'چۆن کارتی سەهمەتی ئەلیکترۆنی تۆمار بکەیت'),
      description: t('从下载应用到完成身份核验的分步演示。', 'A step-by-step walkthrough from download to identity verification.', 'شرح خطوي من التحميل حتى التحقق من الهوية.', 'ڕوونکردنەوەی هەنگاو بە هەنگاو لە دابەزاندنەوە تا پشتڕاستکردنەوەی ناسنامە.'),
      cover: '',
      url: ''
    }
  },
  {
    key: 'rcm_portal_video_002',
    value: {
      sort: 2,
      visible: true,
      duration: '02:15',
      title: t('如何查询每月配给额度', 'How to check your monthly quota', 'كيفية الاستعلام عن الحصة الشهرية', 'چۆن سەهمەتی مانگانە ببینیت'),
      description: t('在公民应用中查看配额、配送状态与领取凭证。', 'View quotas, delivery status and pickup vouchers in the citizen app.', 'شاهد الحصص وحالة التوصيل وسند الاستلام في تطبيق المواطن.', 'سەهمەت و دۆخی گەیاندن و سندی وەرگرتن لە ئەپی هاوڵاتیدا ببینە.'),
      cover: '',
      url: ''
    }
  },
  {
    key: 'rcm_portal_video_003',
    value: {
      sort: 3,
      visible: true,
      duration: '04:05',
      title: t('代理网点扫码核销流程', 'Agent outlet QR verification flow', 'إجراءات التحقق بالرمز في نقاط التوريد', 'ڕێڕەوی سکاکردن لە بنکەکانی تەدارکات'),
      description: t('代理人员如何在现场完成扫码、人脸比对与发放记账。', 'How agents complete scanning, face matching and distribution records on site.', 'كيف يكمل الوكيل المسح ومطابقة الوجه وتسجيل التوزيع في الموقع.', 'چۆن بەرپرس لە شوێنەکە سکاکردن و بەراوردکردنی ڕووخسار و تۆمارکردنی دابەشکردن ئەنجام دەدات.'),
      cover: '',
      url: ''
    }
  },
  {
    key: 'rcm_portal_guide_001',
    value: {
      sort: 1,
      visible: true,
      icon: 'Postcard',
      title: t('填写真实身份信息', 'Enter accurate identity details', 'أدخل معلوماتك الصحيحة', 'زانیاری ناسنامەی ڕاست بنووسە'),
      description: t('姓名、身份证号与家庭关系必须与官方证件一致。', 'Name, national ID and family relations must match official documents.', 'يجب أن تتطابق الاسم والرقم الوطني والصلة العائلية مع الوثائق الرسمية.', 'ناو و ژمارەی ناسنامە و پەیوەندیی خێزان دەبێت لەگەڵ بەڵگەنامە فەرمییەکان یەک بێت.')
    }
  },
  {
    key: 'rcm_portal_guide_002',
    value: {
      sort: 2,
      visible: true,
      icon: 'Iphone',
      title: t('使用本人手机号', 'Use your own phone number', 'استخدم رقم هاتف صحيح', 'ژمارەی تەلەفۆنی خۆت بەکاربهێنە'),
      description: t('手机号将用于验证、通知与后续变更，请勿重复注册。', 'The number is used for verification, notices and future updates. Do not register twice.', 'يُستخدم الرقم للتحقق والإشعارات والتعديلات لاحقًا، ولا تُسجّل أكثر من مرة.', 'ژمارەکە بۆ پشتڕاستکردنەوە و ئاگاداری و گۆڕانکاری بەکاردێت؛ دووجار تۆمار مەکە.')
    }
  },
  {
    key: 'rcm_portal_guide_003',
    value: {
      sort: 3,
      visible: true,
      icon: 'Document',
      title: t('上传有效官方文件', 'Upload valid official documents', 'أرفق الوثائق الرسمية الصحيحة', 'بەڵگەنامە فەرمییەکان بار بکە'),
      description: t('身份证、居住证明与原纸质配给卡照片需清晰完整。', 'ID, residence proof and the old paper card must be clear and complete.', 'صور الهوية وإثبات السكن والبطاقة الورقية القديمة يجب أن تكون واضحة وكاملة.', 'وێنەی ناسنامە و بەڵگەی نیشتەجێبوون و کارتی کاغەزی کۆن دەبێت ڕوون و تەواو بن.')
    }
  },
  {
    key: 'rcm_portal_guide_004',
    value: {
      sort: 4,
      visible: true,
      icon: 'Bell',
      title: t('及时查看应用通知', 'Check in-app notifications', 'انتبه للإشعارات', 'ئاگادارییەکان بپشکنە'),
      description: t('审核结果、发放时间与异常提醒都会第一时间推送。', 'Review results, distribution times and alerts are pushed immediately.', 'تُرسل نتائج المراجعة ومواعيد التوزيع والتنبيهات فورًا.', 'ئەنجامی پشکنین و کاتی دابەشکردن و ئاگادارییەکان دەستبەجێ دەنێردرێن.')
    }
  },
  {
    key: 'rcm_portal_faq_001',
    value: {
      sort: 1,
      visible: true,
      question: t('申请电子配给卡需要哪些材料？', 'What documents are required to apply?', 'ماهي الوثائق المطلوبة للتقديم على البطاقة التموينية الإلكترونية؟', 'چ بەڵگەنامەیەک پێویستە بۆ داواکاری کارتی سەهمەت؟'),
      answer: t('需要本人身份证、居住证明、家庭信息以及原纸质配给卡照片。所有文件需清晰且在有效期内。', 'You need a national ID, residence proof, family details and a photo of the old paper card. Documents must be clear and valid.', 'تحتاج إلى الهوية الوطنية وإثبات السكن وبيانات الأسرة وصورة البطاقة الورقية القديمة، على أن تكون واضحة وسارية.', 'ناسنامەی نیشتمانی و بەڵگەی نیشتەجێبوون و زانیاری خێزان و وێنەی کارتی کاغەزی کۆنت پێویستە.')
    }
  },
  {
    key: 'rcm_portal_faq_002',
    value: {
      sort: 2,
      visible: true,
      question: t('信息提交错误后如何更正？', 'How do I correct information I submitted?', 'ما الإجراء المناسب لتصحيح المعلومات الخاطئة؟', 'ئەگەر زانیاری هەڵە پێشکەش کرا چۆن ڕاست دەکرێتەوە؟'),
      answer: t('在审核完成前可在应用中直接修改；如已进入审核，请联系所属代理网点或拨打服务热线。', 'You can edit directly in the app before review starts. If review has started, contact your agent outlet or the hotline.', 'يمكن التعديل داخل التطبيق قبل اكتمال المراجعة، وبعدها يُرجى مراسلة نقطة التوريد أو الاتصال بالخط الساخن.', 'پێش تەواوبوونی پشکنین دەتوانیت لە ئەپدا دەستکاری بکەیت؛ دوای ئەوە پەیوەندی بە بنکە یان هێڵی خزمەتگوزاری بکە.')
    }
  },
  {
    key: 'rcm_portal_faq_003',
    value: {
      sort: 3,
      visible: true,
      question: t('家庭成员减少时应如何办理？', 'How do I report a change in household size?', 'ما الإجراء عند نقص أحد أفراد الأسرة؟', 'ئەگەر ئەندامێکی خێزان کەم بۆوە چی بکەم؟'),
      answer: t('在“家庭信息变更”中选择减少成员，上传相关证明并提交，审核通过后配额将自动更新。', 'Choose “family update”, select the member, upload supporting proof and submit. The quota updates after approval.', 'اختر «تعديل الأسرة» وحدد العضو وأرفق المستند ثم أرسل الطلب؛ تُحدَّث الحصة بعد الموافقة.', '«گۆڕینی خێزان» هەڵبژێرە و ئەندامەکە دیاری بکە و بەڵگە بار بکە؛ دوای پەسەندکردن سەهمەت نوێ دەبێتەوە.')
    }
  },
  {
    key: 'rcm_portal_faq_004',
    value: {
      sort: 4,
      visible: true,
      question: t('忘记卡号或密码怎么办？', 'I forgot my card number or password. What now?', 'نسيت رقم البطاقة أو كلمة المرور، ماذا أفعل؟', 'ژمارەی کارت یان تێپەڕوشەم لە بیر چووە؟'),
      answer: t('可在登录页使用已登记手机号找回；如手机号已停用，请携带证件到代理网点办理。', 'Use your registered phone number on the login page. If the number is no longer active, visit an agent outlet with your ID.', 'استخدم رقم الهاتف المسجل في صفحة الدخول، وإذا كان الرقم غير مفعّل تفضل بزيارة نقطة التوريد مع الهوية.', 'لە لاپەڕەی چوونەژوورەوە ژمارەی تۆمارکراو بەکاربهێنە؛ ئەگەر ژمارەکە کۆن بووە بە ناسنامەوە بڕۆ بۆ بنکە.')
    }
  },
  {
    key: 'rcm_portal_faq_005',
    value: {
      sort: 5,
      visible: true,
      question: t('登记的手机号停用了如何更换？', 'How do I change a deactivated phone number?', 'كيف أغيّر رقم الهاتف المسجل؟', 'چۆن ژمارەی تەلەفۆنی تۆمارکراو بگۆڕم؟'),
      answer: t('请在应用“账户设置”中提交新号码并完成短信验证；如无法登录，请到代理网点现场办理。', 'Submit a new number in Account Settings and complete SMS verification. If you cannot sign in, visit an agent outlet.', 'أرسل رقمًا جديدًا من إعدادات الحساب وأكّد التحقق عبر الرسائل، أو راجع نقطة التوريد إذا تعذّر الدخول.', 'لە ڕێکخستنی هەژمار ژمارەی نوێ بنێرە و پشتڕاستی SMS بکە؛ ئەگەر ناتوانیت بچیتە ژوورەوە بڕۆ بۆ بنکە.')
    }
  },
  {
    key: 'rcm_portal_app_001',
    value: {
      sort: 1,
      visible: true,
      platform: 'iOS · Android',
      title: t('公民服务应用', 'Citizen service app', 'تطبيق خدمة المواطن', 'ئەپی خزمەتگوزاری هاوڵاتی'),
      description: t('家庭建档、配额查询、在线申领与通知接收。', 'Family registration, quota lookup, online claims and notifications.', 'تسجيل الأسرة والاستعلام عن الحصة والتقديم والإشعارات.', 'تۆماری خێزان و سەهمەت و داواکاری و ئاگادارییەکان.'),
      href: '#/portal'
    }
  },
  {
    key: 'rcm_portal_app_002',
    value: {
      sort: 2,
      visible: true,
      platform: 'iOS · Android',
      title: t('代理网点应用', 'Agent outlet app', 'تطبيق وكلاء التموين', 'ئەپی بنکەکانی تەدارکات'),
      description: t('现场扫码核销、身份核验与发放记账。', 'On-site QR verification, identity checks and distribution records.', 'المسح والتحقق من الهوية وتسجيل التوزيع في الموقع.', 'سکاکردن و پشتڕاستکردنەوەی ناسنامە و تۆماری دابەشکردن لە شوێنەکە.'),
      href: '#/portal'
    }
  }
]

export function cloneSeedRecords() {
  return portalSeedRecords.map((record) => ({
    key: record.key,
    value: JSON.parse(JSON.stringify(record.value))
  }))
}
