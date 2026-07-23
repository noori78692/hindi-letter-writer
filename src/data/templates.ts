import { TemplateItem } from '../types';

export const POPULAR_TEMPLATES: TemplateItem[] = [
  {
    id: 'school_leave_fever',
    title: 'बीमारी के कारण अवकाश हेतु आवेदन',
    department: 'प्रधानाचार्य / कुलपति',
    category: 'अवकाश (छुट्टी) हेतु आवेदन',
    description: 'स्कूल या कॉलेज में 3 दिन की बीमारी की छुट्टी मांगने का प्रारूप',
    type: 'application',
    tone: 'formal',
    badge: 'स्कूल / कॉलेज',
    sampleFields: {
      name: 'अमित कुमार शर्मा',
      fatherName: 'श्री रामेश्वर शर्मा',
      gender: 'पुरुष',
      address: 'ग्राम - रामपुर, डाकखाना - सदर, जिला - वाराणसी, उत्तर प्रदेश',
      mobile: '9876543210',
      email: 'amit.sharma@example.com',
      officerName: 'प्रधानाचार्य महोदय',
      date: new Date().toISOString().slice(0, 10),
      reason: 'मुझे गत रात्रि से अकस्मात तेज़ बुखार आ गया है। डॉक्टर ने मुझे 3 दिनों तक पूर्ण विश्राम करने की सलाह दी है। इस कारण मैं विद्यालय में उपस्थित होने में असमर्थ हूं।',
      duration: '3 दिन (दिनांक 25/07/2026 से 27/07/2026 तक)'
    }
  },
  {
    id: 'bank_new_account',
    title: 'नया बचत बैंक खाता खोलने हेतु',
    department: 'बैंक प्रबंधक (Branch Manager)',
    category: 'नया बैंक खाता खोलने हेतु',
    description: 'भारतीय स्टेट बैंक या किसी भी बैंक में नया बचत खाता',
    type: 'application',
    tone: 'formal',
    badge: 'बैंक कार्य',
    sampleFields: {
      name: 'सुनीता देवी',
      fatherName: 'पति - श्री राजेश यादव',
      gender: 'महिला',
      address: 'मकान नं. 45, गांधी नगर, लखनऊ, उत्तर प्रदेश - 226001',
      mobile: '9123456789',
      officerName: 'शाखा प्रबंधक महोदय',
      date: new Date().toISOString().slice(0, 10),
      reason: 'मैं आपकी प्रतिष्ठित शाखा में एक नया बचत बैंक खाता (Savings Account) खुलवाना चाहती हूं। इसके लिए आवश्यक दस्तावेज (आधार कार्ड, पैन कार्ड एवं फोटो) आवेदन के साथ संलग्न हैं।',
      occupation: 'गृहणी'
    }
  },
  {
    id: 'electricity_bill_corr',
    title: 'बिजली बिल में संशोधन एवं सुधार हेतु',
    department: 'विद्युत विभाग (JE/EXEn)',
    category: 'बिजली बिल में सुधार हेतु',
    description: 'अत्यधिक या गलत बिल आने पर सुधार का आवेदन',
    type: 'application',
    tone: 'office',
    badge: 'विद्युत',
    sampleFields: {
      name: 'राकेश वर्मा',
      fatherName: 'श्री सूरज प्रकाश वर्मा',
      gender: 'पुरुष',
      address: 'मोहल्ला - शास्त्री नगर, गली नं. 2, कानपुर, उत्तर प्रदेश',
      mobile: '9988776655',
      officerName: 'अधिशासी अभियंता महोदय',
      date: new Date().toISOString().slice(0, 10),
      reason: 'मेरे परिसर का विद्युत संयोजन संख्या - 74839201 है। इस माह का बिजली बिल अत्यधिक रु 18,500 प्राप्त हुआ है जो कि मेरी औसत खपत से बहुत अधिक है। संभवतः मीटर रीडिंग अथवा सिस्टम में त्रुटि हुई है। कृपया मीटर की जांच कराकर सही बिल जारी करें।',
      idNumber: '74839201'
    }
  },
  {
    id: 'police_lost_mobile',
    title: 'खोए हुए मोबाइल फोन की शिकायत / FIR',
    department: 'थाना प्रभारी (SO/SHO)',
    category: 'घटना / चोरी की एफआईआर (FIR) दर्ज कराने हेतु',
    description: 'स्मार्टफोन गुम या चोरी होने पर पुलिस सूचना पत्र',
    type: 'application',
    tone: 'veryformal',
    badge: 'पुलिस / FIR',
    sampleFields: {
      name: 'दीपक प्रकाश',
      fatherName: 'श्री हरिशचंद्र',
      gender: 'पुरुष',
      address: 'हाउस नं. 12, सिविल लाइंस, प्रयागराज, उत्तर प्रदेश',
      mobile: '9811223344',
      officerName: 'थाना प्रभारी महोदय',
      date: new Date().toISOString().slice(0, 10),
      reason: 'कल सायं लगभग 6:00 बजे बाज़ार से लौटते समय मेरा मोबाइल फोन (Realme Nord 3, IMEI No: 864539021432109) गुम हो गया है। काफी खोजबीन के बाद भी इसका पता नहीं चल सका। दुरुपयोग की आशंका को देखते हुए कृपया इसकी एनसीआर/रिपोर्ट दर्ज करने की कृपा करें।',
      idNumber: 'IMEI: 864539021432109'
    }
  },
  {
    id: 'tehsil_caste_cert',
    title: 'जाति एवं निवास प्रमाण पत्र जारी करने हेतु',
    department: 'तहसीलदार / एसडीएम',
    category: 'जाति प्रमाण पत्र हेतु',
    description: 'तहसील से प्रमाण पत्र बनवाने का औपचारिक पत्र',
    type: 'application',
    tone: 'rural',
    badge: 'तहसील / राजस्व',
    sampleFields: {
      name: 'संजय कुमार',
      fatherName: 'श्री बाबूराम',
      gender: 'पुरुष',
      address: 'ग्राम - कल्याणपुर, पोस्ट - सहसों, तहसील - फूलपुर, जिला - प्रयागराज',
      mobile: '9765432109',
      officerName: 'तहसीलदार महोदय',
      date: new Date().toISOString().slice(0, 10),
      reason: 'प्रार्थी को आगामी सरकारी भर्ती एवं छात्रवृत्ति हेतु अन्य पिछड़ा वर्ग (OBC) जाति प्रमाण पत्र तथा निवास प्रमाण पत्र की अत्यंत आवश्यकता है। लेखपाल की आख्या संलग्न है। अतः निर्गत करने की कृपा करें।',
      village: 'कल्याणपुर',
      district: 'प्रयागराज',
      state: 'उत्तर प्रदेश',
      pincode: '211019'
    }
  },
  {
    id: 'rti_information',
    title: 'RTI 2005 के तहत सूचना मांगने हेतु',
    department: 'जिलाधिकारी (DM)',
    category: 'सूचना का अधिकार (RTI) आवेदन',
    description: 'सरकारी योजना या निर्माण कार्य की जानकारी हेतु',
    type: 'application',
    tone: 'veryformal',
    badge: 'कानूनी / RTI',
    sampleFields: {
      name: 'सत्येंद्र नाथ त्रिपाठी',
      fatherName: 'श्री केदारनाथ त्रिपाठी',
      gender: 'पुरुष',
      address: 'ग्राम - रामपुर मोड़, जिला - गोरखपुर, उत्तर प्रदेश',
      mobile: '9415012345',
      officerName: 'जन सूचना अधिकारी / जिलाधिकारी कार्यालय',
      date: new Date().toISOString().slice(0, 10),
      reason: 'सूचना का अधिकार अधिनियम 2005 की धारा 6(1) के तहत: ग्राम रामपुर में वर्ष 2024-25 में निर्मित पक्की सड़क के कुल बजट, स्वीकृत राशि एवं प्रयुक्त निर्माण सामग्री की प्रमाणीकृत प्रतिलिपियां 30 दिनों के भीतर उपलब्ध कराने का कष्ट करें।',
      refNumber: 'RTI-2026/048'
    }
  },
  {
    id: 'pension_oldage',
    title: 'वृद्धावस्था पेंशन स्वीकृत कराने हेतु',
    department: 'समाज कल्याण अधिकारी',
    category: 'पेंशन योजना स्वीकृति हेतु',
    description: 'वरिष्ठ नागरिक द्वारा पेंशन चालू कराने का पत्र',
    type: 'application',
    tone: 'rural',
    badge: 'पेंशन / कल्याण',
    sampleFields: {
      name: 'रामप्रसाद',
      fatherName: 'दिवंगत श्री शिवपूजन',
      gender: 'पुरुष',
      address: 'ग्राम - नगला भूप, पोस्ट - अकोला, जिला - आगरा',
      mobile: '9358123456',
      officerName: 'जिला समाज कल्याण अधिकारी',
      date: new Date().toISOString().slice(0, 10),
      reason: 'प्रार्थी की आयु 67 वर्ष हो चुकी है तथा जीवनयापन हेतु कोई अन्य आय का साधन नहीं है। प्रार्थी वृद्धावस्था पेंशन योजना की सभी शर्तें पूर्ण करता है। आयु प्रमाण पत्र व आधार कार्ड संलग्न है।',
      village: 'नगला भूप',
      district: 'आगरा',
      state: 'उत्तर प्रदेश',
      pincode: '283102'
    }
  }
];
