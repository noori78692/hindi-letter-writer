import { DepartmentItem, CategoryItem, ToneType } from '../types';

export const DEPARTMENTS: DepartmentItem[] = [
  { id: 'dm', name: 'जिलाधिकारी (DM)', categoryGroup: 'प्रशासनिक', iconName: 'Building2', defaultTitle: 'सेवा में, श्रीमान जिलाधिकारी महोदय', description: 'जिला प्रशासन, जनसुनवाई, मुआवजा, सुरक्षा' },
  { id: 'tehsildar', name: 'तहसीलदार / एसडीएम', categoryGroup: 'राजस्व', iconName: 'FileSpreadsheet', defaultTitle: 'सेवा में, श्रीमान तहसीलदार महोदय', description: 'आय, जाति, निवास प्रमाण पत्र, भूमि विवाद' },
  { id: 'police', name: 'थाना प्रभारी (SO/SHO)', categoryGroup: 'सुरक्षा', iconName: 'ShieldAlert', defaultTitle: 'सेवा में, श्रीमान थाना प्रभारी महोदय', description: 'प्राथमिकी (FIR), चरित्र प्रमाण पत्र, शिकायत' },
  { id: 'bank', name: 'बैंक प्रबंधक (Branch Manager)', categoryGroup: 'वित्तीय', iconName: 'Landmark', defaultTitle: 'सेवा में, श्रीमान शाखा प्रबंधक', description: 'खाता खोलना/बंद करना, एटीएम, लोन, पासबुक' },
  { id: 'principal', name: 'प्रधानाचार्य / कुलपति', categoryGroup: 'शिक्षा', iconName: 'GraduationCap', defaultTitle: 'सेवा में, श्रीमान प्रधानाचार्य महोदय', description: 'छुट्टी, फीस माफी, टीसी, छात्रवृत्ति, चरित्र प्रमाण पत्र' },
  { id: 'electricity', name: 'विद्युत विभाग (JE/EXEn)', categoryGroup: 'जनसुविधा', iconName: 'Zap', defaultTitle: 'सेवा में, श्रीमान अधिशासी अभियंता (विद्युत)', description: 'बिजली बिल सुधार, नया कनेक्शन, मीटर बदलना' },
  { id: 'panchayat', name: 'ग्राम प्रधान / बीडीओ / पंचायत', categoryGroup: 'स्थानीय निकाय', iconName: 'Home', defaultTitle: 'सेवा में, श्रीमान खंड विकास अधिकारी (BDO)', description: 'आवास योजना, नाली/सड़क, पेंशन, जन्म/मृत्यु प्रमाण पत्र' },
  { id: 'nagar_nigam', name: 'नगर निगम / नगरपालिका', categoryGroup: 'स्थानीय निकाय', iconName: 'Building', defaultTitle: 'सेवा में, श्रीमान नगर आयुक्त / अधिशासी अधिकारी', description: 'सफाई व्यवस्था, स्ट्रीट लाइट, जल भराव, संपत्ति कर' },
  { id: 'jal_nigam', name: 'जल निगम / जलकल विभाग', categoryGroup: 'जनसुविधा', iconName: 'Droplets', defaultTitle: 'सेवा में, श्रीमान जलकल अभियंता', description: 'पेयजल समस्या, पाइपलाइन रिसाव, नया जल कनेक्शन' },
  { id: 'ration', name: 'खाद्य एवं रसद विभाग (राशन)', categoryGroup: 'जनसुविधा', iconName: 'ShoppingBag', defaultTitle: 'सेवा में, श्रीमान पूर्ति निरीक्षक (राशन)', description: 'नया राशन कार्ड, नाम जोड़ना/काटना, राशन न मिलना' },
  { id: 'pension', name: 'समाज कल्याण अधिकारी', categoryGroup: 'कल्याणकारी', iconName: 'HeartHandshake', defaultTitle: 'सेवा में, श्रीमान जिला समाज कल्याण अधिकारी', description: 'वृद्धा/विधवा/दिव्यांग पेंशन, पारिवारिक लाभ' },
  { id: 'health', name: 'मुख्य चिकित्सा अधिकारी (CMO)', categoryGroup: 'स्वास्थ्य', iconName: 'Activity', defaultTitle: 'सेवा में, श्रीमान मुख्य चिकित्सा अधिकारी', description: 'आयुष्मान कार्ड, मेडिकल फिटनेस, अस्पताल शिकायत' },
  { id: 'transport', name: 'एआरटीओ / परिवहन विभाग', categoryGroup: 'परिवहन', iconName: 'Car', defaultTitle: 'सेवा में, श्रीमान सहायक क्षेत्रीय परिवहन अधिकारी', description: 'ड्राइविंग लाइसेंस, वाहन पंजीकरण, एनओसी' },
  { id: 'gas', name: 'गैस एजेंसी प्रबंधक', categoryGroup: 'जनसुविधा', iconName: 'Flame', defaultTitle: 'सेवा में, श्रीमान प्रबंधक, गैस एजेंसी', description: 'नया गैस कनेक्शन, केवाईसी, नाम परिवर्तन' },
  { id: 'insurance', name: 'बीमा कंपनी प्रबंधक', categoryGroup: 'वित्तीय', iconName: 'ShieldCheck', defaultTitle: 'सेवा में, श्रीमान शाखा प्रबंधक, बीमा कंपनी', description: 'दावा (Claim) भुगतान, पॉलिसी नवीनीकरण' },
  { id: 'private_company', name: 'निजी कंपनी / HR', categoryGroup: 'कार्यालयी', iconName: 'Briefcase', defaultTitle: 'सेवा में, श्रीमान मानव संसाधन प्रबंधक (HR)', description: 'नौकरी आवेदन, त्यागपत्र (Resignation), वेतन वृद्धि, अनुभव पत्र' },
  { id: 'post_office', name: 'डाकपाल (Postmaster)', categoryGroup: 'डाक', iconName: 'Mail', defaultTitle: 'सेवा में, श्रीमान डाकपाल महोदय', description: 'डाक न मिलना, खाता स्थानांतरण, एनएससी' },
  { id: 'railway', name: 'स्टेशन मास्टर / रेलवे', categoryGroup: 'परिवहन', iconName: 'TrainTrack', defaultTitle: 'सेवा में, श्रीमान स्टेशन अधीक्षक', description: 'सामान चोरी, रिफंड दावा, शिकायत' },
  { id: 'custom', name: 'अन्य विभाग', categoryGroup: 'अन्य', iconName: 'HelpCircle', defaultTitle: 'सेवा में, श्रीमान संबंधित अधिकारी', description: 'किसी भी अन्य विभाग के लिए विशेष आवेदन' }
];

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'leave',
    name: 'अवकाश (छुट्टी) हेतु आवेदन',
    introSentence: 'मैं आपकी संस्था/कार्यालय में कार्यरत/अध्ययनरत हूं तथा निम्नलिखित कारण से आवश्यक अवकाश प्राप्त करने हेतु प्रार्थी हूं।',
    extraFields: ['duration'],
    description: 'बीमारी, शादी, घरेलू कार्य आदि के लिए छुट्टी'
  },
  {
    id: 'scholarship',
    name: 'छात्रवृत्ति हेतु आवेदन',
    introSentence: 'मैं आपके संस्थान का नियमित छात्र/छात्रा हूं तथा पारिवारिक आर्थिक स्थिति को देखते हुए छात्रवृत्ति हेतु नम्र निवेदन करता/करती हूं।',
    extraFields: ['occupation', 'idNumber'],
    description: 'विद्यालय/कॉलेज में छात्रवृत्ति प्राप्त करने हेतु'
  },
  {
    id: 'fee_concession',
    name: 'शुल्क (फीस) माफी हेतु आवेदन',
    introSentence: 'मैं आपकी संस्था में अध्ययनरत हूं तथा आर्थिक असमर्थता के कारण शिक्षण शुल्क में छूट प्रदान करने हेतु विनम्र प्रार्थना करता/करती हूं।',
    extraFields: ['occupation'],
    description: 'स्कूल/कॉलेज की फीस में छूट पाने हेतु'
  },
  {
    id: 'character_cert',
    name: 'चरित्र प्रमाण पत्र हेतु',
    introSentence: 'मुझे आगामी शैक्षणिक/शासकीय प्रक्रिया हेतु चरित्र प्रमाण पत्र की अत्यंत आवश्यकता है, अतः इसे निर्गत करने की कृपा करें।',
    extraFields: ['village', 'district', 'state', 'pincode'],
    description: 'विद्यालय/पुलिस/तहसील से चरित्र प्रमाण पत्र'
  },
  {
    id: 'domicile_cert',
    name: 'निवास प्रमाण पत्र हेतु',
    introSentence: 'मुझे आवश्यक शासकीय/शैक्षणिक कार्यों हेतु स्थायी निवास प्रमाण पत्र की आवश्यकता है, अतः निर्गत करने का कष्ट करें।',
    extraFields: ['village', 'district', 'state', 'pincode'],
    description: 'डोमिसाइल/निवास प्रमाण पत्र'
  },
  {
    id: 'income_cert',
    name: 'आय प्रमाण पत्र हेतु',
    introSentence: 'मुझे शासकीय योजना/छात्रवृत्ति हेतु आय प्रमाण पत्र की आवश्यकता है, अतः प्रार्थी का आय प्रमाण पत्र जारी करने की कृपा करें।',
    extraFields: ['occupation', 'village', 'district', 'state', 'pincode'],
    description: 'वार्षिक आय का प्रमाण पत्र जारी करने हेतु'
  },
  {
    id: 'caste_cert',
    name: 'जाति प्रमाण पत्र हेतु',
    introSentence: 'मुझे शासकीय योजना एवं दाखिले हेतु जाति प्रमाण पत्र की आवश्यकता है, अतः इसे शीघ्रातिशीघ्र निर्गत करने की कृपा करें।',
    extraFields: ['village', 'district', 'state', 'pincode'],
    description: 'अनुसूचित जाति/जनजाति/पिछड़ा वर्ग प्रमाण पत्र'
  },
  {
    id: 'bank_account',
    name: 'नया बैंक खाता खोलने हेतु',
    introSentence: 'मैं आपकी शाखा में एक नया बचत/चालू बैंक खाता खुलवाने का इच्छुक हूं, अतः आवश्यक प्रक्रिया पूर्ण करने की कृपा करें।',
    extraFields: ['idNumber', 'occupation'],
    description: 'बैंक में बचत/चालू खाता खोलने हेतु'
  },
  {
    id: 'bank_atm',
    name: 'नया एटीएम कार्ड जारी कराने हेतु',
    introSentence: 'मेरा बैंक खाता आपकी शाखा में संचालित है तथा मुझे दैनिक लेनदेन हेतु नया डेबिट/एटीएम कार्ड जारी करने का कष्ट करें।',
    extraFields: ['idNumber'],
    description: 'एटीएम कार्ड चोरी/गुम होने या नया पाने हेतु'
  },
  {
    id: 'electricity_bill',
    name: 'बिजली बिल में सुधार हेतु',
    introSentence: 'मेरे विद्युत संयोजन का बिल इस माह अत्यधिक एवं त्रुटिपूर्ण प्राप्त हुआ है, अतः इसे संशोधित करने की कृपा करें।',
    extraFields: ['idNumber', 'village', 'district'],
    description: 'गलत/अत्यधिक बिजली बिल का निस्तारण'
  },
  {
    id: 'water_complaint',
    name: 'पेयजल किल्लत / पाइपलाइन शिकायत',
    introSentence: 'मैं आपका ध्यान हमारे मोहल्ले/क्षेत्र में गंभीर पेयजल संकट एवं अस्वच्छ जलापूर्ति की ओर आकृष्ट कराना चाहता/चाहती हूं।',
    extraFields: ['village', 'district'],
    description: 'पानी न आने या गंदे पानी की समस्या'
  },
  {
    id: 'road_repair',
    name: 'सड़क/नाली निर्माण एवं मरम्मत हेतु',
    introSentence: 'हमारे क्षेत्र की मुख्य सड़क अत्यंत जर्जर स्थिति में है, जिससे आए दिन दुर्घटनाएं होती रहती हैं। अतः मरम्मत कराने की कृपा करें।',
    extraFields: ['village', 'district'],
    description: 'टूटी सड़क, गड्ढे व नाली सफाई हेतु'
  },
  {
    id: 'pension_scheme',
    name: 'पेंशन योजना स्वीकृति हेतु',
    introSentence: 'मैं सरकार की वृद्धावस्था/विधवा/दिव्यांग पेंशन योजना हेतु पात्र हूं तथा पेंशन स्वीकृत कराने हेतु नम्र निवेदन करता/करती हूं।',
    extraFields: ['idNumber', 'village', 'district'],
    description: 'वृद्धा, विधवा या विकलांग पेंशन चालू कराना'
  },
  {
    id: 'police_fir',
    name: 'घटना / चोरी की एफआईआर (FIR) दर्ज कराने हेतु',
    introSentence: 'मैं निम्नलिखित घटित अप्रिय घटना/सामान चोरी के संबंध में प्रथम सूचना रिपोर्ट (FIR) दर्ज कराने हेतु आवेदन कर रहा/रही हूं।',
    extraFields: ['village', 'district', 'idNumber'],
    description: 'मोबाइल, दस्तावेज, वाहन या सामान चोरी की शिकायत'
  },
  {
    id: 'rti_application',
    name: 'सूचना का अधिकार (RTI) आवेदन',
    introSentence: 'सूचना का अधिकार अधिनियम, 2005 की धारा 6(1) के अंतर्गत मैं निम्नलिखित बिंदुओं पर प्रमाणीकृत सूचना प्राप्त करना चाहता/चाहती हूं।',
    extraFields: ['refNumber'],
    description: 'RTI Act 2005 के तहत जानकारी प्राप्त करना'
  },
  {
    id: 'job_application',
    name: 'नौकरी / पद हेतु आवेदन',
    introSentence: 'आपकी प्रतिष्ठित संस्था में विज्ञापित पद हेतु मैं अपनी शैक्षणिक योग्यता एवं कार्य अनुभव के साथ उम्मीदवारी प्रस्तुत करता/करती हूं।',
    extraFields: ['occupation'],
    description: 'सरकारी या निजी क्षेत्र में नौकरी हेतु'
  },
  {
    id: 'resignation',
    name: 'त्यागपत्र (Resignation Letter)',
    introSentence: 'मैं अपने व्यक्तिगत/अपरिहार्य कारणों से संस्था में अपने वर्तमान पद से त्यागपत्र प्रस्तुत कर रहा/रही हूं।',
    extraFields: ['occupation', 'duration'],
    description: 'सेवा से स्वेच्छापूर्वक त्यागपत्र प्रस्तुत करना'
  },
  {
    id: 'experience_cert',
    name: 'कार्य अनुभव प्रमाण पत्र हेतु',
    introSentence: 'मैंने आपकी संस्था में सफलतापूर्वक कार्य किया है तथा भविष्य के अवसरों हेतु मुझे अनुभव प्रमाण पत्र प्रदान करने की कृपा करें।',
    extraFields: ['occupation', 'duration'],
    description: 'कंपनी/संस्था से Experience Certificate मांगना'
  },
  {
    id: 'transfer_cert',
    name: 'स्थानांतरण प्रमाण पत्र (TC) हेतु',
    introSentence: 'मैंने अपनी कक्षा पूर्ण कर ली है तथा आगे के अध्ययन हेतु मुझे स्थानांतरण प्रमाण पत्र (TC) एवं चरित्र प्रमाण पत्र निर्गत करें।',
    extraFields: ['duration'],
    description: 'विद्यालय/कॉलेज से TC प्राप्त करना'
  },
  {
    id: 'noc_request',
    name: 'अनापत्ति प्रमाण पत्र (NOC) हेतु',
    introSentence: 'मुझे निम्नलिखित प्रयोजन हेतु आपकी संस्था से अनापत्ति प्रमाण पत्र (NOC) की आवश्यकता है, अतः जारी करने की कृपा करें।',
    extraFields: ['refNumber'],
    description: 'विदेश यात्रा, अन्य नौकरी या निर्माण कार्य हेतु NOC'
  },
  {
    id: 'custom_subject',
    name: 'अन्य विशेष विषय',
    introSentence: 'मैं निम्नलिखित विषय के संदर्भ में आपसे आदरपूर्वक निवेदन करना चाहता/चाहती हूं।',
    extraFields: ['refNumber'],
    description: 'अपनी आवश्यकतानुसार कोई भी नया विषय लिखें'
  }
];

export const TONE_STYLES: Record<ToneType, { label: string; salutation: string; closing: string; sign: string; desc: string }> = {
  formal: {
    label: 'मानक औपचारिक (Formal)',
    salutation: 'महोदय/महोदया,',
    closing: 'सधन्यवाद।',
    sign: 'भवदीय/भवदीया',
    desc: 'सामान्य सरकारी एवं बैंक पत्राचार के लिए आदर्श'
  },
  veryformal: {
    label: 'अत्यंत विनम्र/उच्च स्तर (Very Formal)',
    salutation: 'परम आदरणीय महोदय/महोदया,',
    closing: 'सधन्यवाद, मैं सदैव आपका/आपकी आभारी रहूंगा/रहूंगी।',
    sign: 'आपका/आपकी अति विनम्र प्रार्थी',
    desc: 'उच्च अधिकारियों एवं न्यायपालिकाओं हेतु'
  },
  simple: {
    label: 'सरल हिंदी (Simple Hindi)',
    salutation: 'महोदय जी,',
    closing: 'धन्यवाद।',
    sign: 'आपका/आपकी',
    desc: 'आसान, सुबोध एवं स्पष्ट शब्दों में'
  },
  rural: {
    label: 'ग्रामीण/तहसील शैली (Local/Rural)',
    salutation: 'श्रीमान जी,',
    closing: 'आपकी अति कृपा होगी। धन्यवाद।',
    sign: 'प्रार्थी/प्रार्थिनी',
    desc: 'तहसील, पंचायत एवं ग्रामीण जनसुनवाई हेतु'
  },
  office: {
    label: 'कार्यालयी/व्यावसायिक (Corporate Office)',
    salutation: 'महोदय,',
    closing: 'उपरोक्त विषय पर शीघ्रातिशीघ्र आवश्यक कार्यवाही हेतु साभार।',
    sign: 'भवदीय/भवदीया',
    desc: 'कंपनी, एचआर एवं व्यावसायिक पत्राचार'
  }
};
