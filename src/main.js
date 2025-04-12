import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueI18n from "vue-i18n";

Vue.config.productionTip = false;

Vue.use(VueI18n);

const messages = {
  en: {
    mobilereg: "Hello please complete Register",
    welcomeindex: "Maintenance reservation & reminders",
    buttonindex: "Sign In/Create account",
    switchlang: "Switch Language",
    placecheck: "Please enter your phone number",
    checkbutton: "Check",
    enterpass: "Enter Password",
    loginbtn: "Login",
    infolog: "Hello, {name} please complete login",
    brand: "Brand",
    model: "Model",
    color: "Color",
    platenumber: "plate Number",
    years: "Year",
    cartype: "Car Type",
    vinnumber: "Vin Number",
    wherevin: "Where can I find the VIN number?",
    addcarbtn: "Add Car",
    carinfo: "Add Your Car Info",
    choosecar: "Choose Car to Add Booking",
    servicechoose: "Choose Service",
    pickdate: "Pick date and Time",
    selectcar: "Selected Car",
    bookingbtn: "Send Booking",
    notedes: "Tell us what is your problem",
    branchselect: "Select Branch",
    bookingdetails: "Booking Details",
    date: "Date",
    acceptbtn: "Accept",
    acceptorder: "Customer approval request for spare parts",
    namepart: "Part name",
    price: "price",
    quantity: "quantity",
    approve: "approval",
    service: "Service",
    location: "Location",
    note: "Note",
    name: "Name",
    phone: "Phone Number",
    confirmbooking: "Booking Sent and it is request",
    finish: "Fisish",
    jobinfo: "Your Job Sheet",
    jobsheetno: "jon_ sheet_no",
    Bookingstatus: "Booking Status",
    totalamount: "Total number",
    totalprice: "Total Price",
    timeend: "Time the work ended",
    timeended: "work ended",
    inforequest: "Info Request",
    hour: "Hour",
    day: "Day",
    second: "Second",
    minute: "Minute",
    bookingifonot: "Booking Info",
    welcome: "Hi",
    greeting: "Hello, {name}!",
    logout: "Logout",
    regbtn: "Register",
    fullname: "Full Name",
    entercode: "Enter Code",
    datareg: "We sent SMS with an activation code to your phone",
  },
  ar: {
    entercode: "ادخل الكود",
    datareg: "لقد أرسلنا لك رسالة نصية قصيرة تحتوي على رمز التفعيل إلى هاتفك",
    fullname: "الاسم",
    regbtn: "تسجيل",
    mobilereg: "مرحباً، يرجى إكمال التسجيل",
    bookingifonot: "معلومات الحجز",
    Bookingstatus: "حالة الحجز",
    acceptbtn: "الموافقة",
    logout: "تسجيل الخروج",
    hour: "ساعة",
    day: "يوم",
    second: "ثانية",
    minute: "دقيقة",
    inforequest: "معلومات الطلب",
    timeend: "وقت انتهاء العمل",
    timeended: "تم انتهاء العمل",
    welcomeindex: "حجز الصيانة والتذكيرات",
    buttonindex: "تسجيل الدخول/إنشاء حساب",
    switchlang: "تغير اللغه",
    placecheck: "من فضلك ادخل رقم الهاتف",
    checkbutton: "البحث",
    acceptorder: "طلب موافقه العميل علي قطع الغيار",
    enterpass: "ادخل كلمه المرور",
    loginbtn: "تسجيل الدخول",
    infolog: "مرحبا, {name} من فضلك اكمل تسجيل الدخول",
    brand: "ماركة",
    model: "موديل",
    color: "لون",
    namepart: "اسم القطعة",
    price: "السعر",
    quantity: "الكمية",
    approve: "الموافقة",
    totalamount: "العدد الكلي",
    totalprice: "السعر الكلي",
    jobinfo: "تقارير اعمالك",
    jobsheetno: "رقم العمل",
    platenumber: "رقم اللوحة",
    confirmbooking: "تم الحجز وهو يكون request",
    years: "سنة",
    cartype: "نوع السياره",
    vinnumber: "رقم الشاسية",
    wherevin: "اين استطيع ان أجد رقم الشاسية؟",
    carinfo: "اضف معلومات السيارة",
    addcarbtn: "اضافة سيارة",
    choosecar: "اختيار سياره للحجز",
    servicechoose: "اختار الخدمة",
    pickdate: "اختر التاريخ والوقت",
    selectcar: "السيارة المختارة",
    bookingbtn: "إرسال الحجز",
    notedes: "أخبرنا ما هي مشكلتك",
    branchselect: "اختار الفرع",
    bookingdetails: "تفاصيل الحجز",
    date: "التاريخ",
    service: "الخدمة",
    location: "الموقع",
    note: "الملاحظة",
    name: "الاسم",
    phone: "رقم الهاتف",
    finish: "الانتهاء",
    welcome: "مرحبا",
    greeting: "مرحباً، {name}!",
  },
};

const savedLocale = localStorage.getItem("locale") || "en";

const i18n = new VueI18n({
  locale: savedLocale,
  fallbackLocale: "en",
  messages,
});

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
