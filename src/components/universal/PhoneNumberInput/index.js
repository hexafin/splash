import React, { Component } from "react";
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    ActionSheetIOS,
    Picker,
    Modal,
    TouchableWithoutFeedback
} from "react-native";
import { colors } from "../../../lib/colors";
import { defaults } from "../../../lib/styles";
import PropTypes from "prop-types";
import LoadingCircle from "../LoadingCircle"
import Button from "../Button"

// function that formats and restricts phone number input - used with redux-form's normalize
const normalizePhone = (value, previousValue) => {
    if (!value) {
        return value;
    }
    const onlyNums = value.replace(/[^\d]/g, "");
    if (!previousValue || value.length > previousValue.length) {
        // typing forward
        if (onlyNums.length === 3) {
            return onlyNums + " ";
        }
        if (onlyNums.length === 6) {
            return onlyNums.slice(0, 3) + " " + onlyNums.slice(3) + " ";
        }
    }
    if (onlyNums.length <= 3) {
        return onlyNums;
    }
    if (onlyNums.length <= 6) {
        return onlyNums.slice(0, 3) + " " + onlyNums.slice(3);
    }
    return (
        onlyNums.slice(0, 3) +
        " " +
        onlyNums.slice(3, 6) +
        " " +
        onlyNums.slice(6, 10)
    );
};

const countryList = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "American Samoa",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antarctica",
    "Argentina",
    "Armenia",
    "Aruba",
    "Ascension Island",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia",
    "Botswana",
    "Brazil",
    "British Indian Ocean Territory",
    "Burkina Faso",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Canary Islands",
    "Cape Verde",
    "Cayman Islands",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Christmas Island",
    "Colombia",
    "Comoros",
    "Cook Islands",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Ethiopia",
    "Falkland Islands",
    "Faroe Islands",
    "Fiji",
    "Finland",
    "France",
    "French Guiana",
    "French Polynesia",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Grenada",
    "Guadeloupe",
    "Guam",
    "Guatemala",
    "Guernsey",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Isle of Man",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jersey",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kuwait",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macedonia",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Martinique",
    "Mauritania",
    "Mauritius",
    "Mayotte",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Montserrat",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Niue",
    "Norfolk Island",
    "Northern Mariana Islands",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    // "R\xc3\xa9union",
    "Romania",
    "Russia",
    "Rwanda",
    "Samoa",
    "San Marino",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Swaziland",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tokelau",
    "Tonga",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela",
    "Western Sahara",
    "Yemen",
    "Zambia",
    "Zimbabwe"
];

const countryData = {
    Canada: { flag: "\ud83c\udde8\ud83c\udde6", code: "1" },
    "Guinea-Bissau": { flag: "\ud83c\uddec\ud83c\uddfc", code: "245" },
    "Saint Helena": { flag: "", code: "290" },
    Lithuania: { flag: "\ud83c\uddf1\ud83c\uddf9", code: "370" },
    Cambodia: { flag: "\ud83c\uddf0\ud83c\udded", code: "855" },
    Switzerland: { flag: "\ud83c\udde8\ud83c\udded", code: "41" },
    Ethiopia: { flag: "\ud83c\uddea\ud83c\uddf9", code: "251" },
    Aruba: { flag: "\ud83c\udde6\ud83c\uddfc", code: "297" },
    Swaziland: { flag: "\ud83c\uddf8\ud83c\uddff", code: "268" },
    "Cyprus- Republic of": { flag: "", code: "357" },
    Palestine: { flag: "", code: "970" },
    Argentina: { flag: "\ud83c\udde6\ud83c\uddf7", code: "54" },
    Bolivia: { flag: "\ud83c\udde7\ud83c\uddf4", code: "591" },
    Cameroon: { flag: "\ud83c\udde8\ud83c\uddf2", code: "237" },
    "Burkina Faso": { flag: "\ud83c\udde7\ud83c\uddeb", code: "226" },
    Turkmenistan: { flag: "\ud83c\uddf9\ud83c\uddf2", code: "993" },
    Bahrain: { flag: "\ud83c\udde7\ud83c\udded", code: "973" },
    "Saudi Arabia": { flag: "\ud83c\uddf8\ud83c\udde6", code: "966" },
    Rwanda: { flag: "\ud83c\uddf7\ud83c\uddfc", code: "250" },
    Togo: { flag: "\ud83c\uddf9\ud83c\uddec", code: "228" },
    Japan: { flag: "\ud83c\uddef\ud83c\uddf5", code: "81" },
    "American Samoa": { flag: "\ud83c\udde6\ud83c\uddf8", code: "1" },
    "United States Minor Outlying Islands": { flag: "", code: "699" },
    "Northern Mariana Islands": { flag: "\ud83c\uddf2\ud83c\uddf5", code: "1" },
    Pitcairn: { flag: "", code: "872" },
    Guatemala: { flag: "\ud83c\uddec\ud83c\uddf9", code: "502" },
    "Bosnia and Herzegovina": { flag: "", code: "387" },
    Kuwait: { flag: "\ud83c\uddf0\ud83c\uddfc", code: "965" },
    "Ascension Island": { flag: "\ud83c\udde6\ud83c\udde8", code: "247" },
    Jordan: { flag: "\ud83c\uddef\ud83c\uddf4", code: "962" },
    Panama: { flag: "\ud83c\uddf5\ud83c\udde6", code: "507" },
    Dominica: { flag: "\ud83c\udde9\ud83c\uddf2", code: "1" },
    Liberia: { flag: "\ud83c\uddf1\ud83c\uddf7", code: "231" },
    Maldives: { flag: "\ud83c\uddf2\ud83c\uddfb", code: "960" },
    Jamaica: { flag: "\ud83c\uddef\ud83c\uddf2", code: "1" },
    Oman: { flag: "\ud83c\uddf4\ud83c\uddf2", code: "968" },
    Tanzania: { flag: "\ud83c\uddf9\ud83c\uddff", code: "255" },
    Martinique: { flag: "\ud83c\uddf2\ud83c\uddf6", code: "596" },
    "Ceuta and Melilla": { flag: "", code: "34" },
    "Christmas Island": { flag: "\ud83c\udde8\ud83c\uddfd", code: "61" },
    Gabon: { flag: "\ud83c\uddec\ud83c\udde6", code: "241" },
    Niue: { flag: "\ud83c\uddf3\ud83c\uddfa", code: "683" },
    Monaco: { flag: "\ud83c\uddf2\ud83c\udde8", code: "377" },
    "Virgin Islands- U.S.": { flag: "", code: "1" },
    "New Zealand": { flag: "\ud83c\uddf3\ud83c\uddff", code: "64" },
    Yemen: { flag: "\ud83c\uddfe\ud83c\uddea", code: "967" },
    Jersey: { flag: "\ud83c\uddef\ud83c\uddea", code: "44" },
    Andorra: { flag: "\ud83c\udde6\ud83c\udde9", code: "376" },
    Albania: { flag: "\ud83c\udde6\ud83c\uddf1", code: "355" },
    Samoa: { flag: "\ud83c\uddfc\ud83c\uddf8", code: "685" },
    "Korea- Democratic People's Republic of": { flag: "", code: "850" },
    "Norfolk Island": { flag: "\ud83c\uddf3\ud83c\uddeb", code: "672" },
    "United Arab Emirates": { flag: "\ud83c\udde6\ud83c\uddea", code: "971" },
    Guam: { flag: "\ud83c\uddec\ud83c\uddfa", code: "1" },
    India: { flag: "\ud83c\uddee\ud83c\uddf3", code: "91" },
    Azerbaijan: { flag: "\ud83c\udde6\ud83c\uddff", code: "994" },
    Lesotho: { flag: "\ud83c\uddf1\ud83c\uddf8", code: "266" },
    "Saint Vincent and the Grenadines": { flag: "", code: "1" },
    "S\u00e3o Tome and Principe": { flag: "", code: "239" },
    Kenya: { flag: "\ud83c\uddf0\ud83c\uddea", code: "254" },
    "South Korea": { flag: "\ud83c\uddf0\ud83c\uddf7", code: "850" },
    Macao: { flag: "", code: "853" },
    Turkey: { flag: "\ud83c\uddf9\ud83c\uddf7", code: "90" },
    Afghanistan: { flag: "\ud83c\udde6\ud83c\uddeb", code: "93" },
    Bangladesh: { flag: "\ud83c\udde7\ud83c\udde9", code: "880" },
    Mauritania: { flag: "\ud83c\uddf2\ud83c\uddf7", code: "222" },
    "Solomon Islands": { flag: "\ud83c\uddf8\ud83c\udde7", code: "677" },
    "Turks and Caicos Islands": { flag: "", code: "1" },
    "Saint Lucia": { flag: "", code: "1" },
    "San Marino": { flag: "\ud83c\uddf8\ud83c\uddf2", code: "378" },
    "French Polynesia": { flag: "\ud83c\uddf5\ud83c\uddeb", code: "689" },
    France: { flag: "\ud83c\uddeb\ud83c\uddf7", code: "33" },
    Bermuda: { flag: "\ud83c\udde7\ud83c\uddf2", code: "1" },
    Slovakia: { flag: "\ud83c\uddf8\ud83c\uddf0", code: "421" },
    Somalia: { flag: "\ud83c\uddf8\ud83c\uddf4", code: "252" },
    Peru: { flag: "\ud83c\uddf5\ud83c\uddea", code: "51" },
    Laos: { flag: "\ud83c\uddf1\ud83c\udde6", code: "856" },
    Nauru: { flag: "\ud83c\uddf3\ud83c\uddf7", code: "674" },
    Seychelles: { flag: "\ud83c\uddf8\ud83c\udde8", code: "248" },
    Norway: { flag: "\ud83c\uddf3\ud83c\uddf4", code: "47" },
    Malawi: { flag: "\ud83c\uddf2\ud83c\uddfc", code: "265" },
    "Cook Islands": { flag: "\ud83c\udde8\ud83c\uddf0", code: "682" },
    Benin: { flag: "\ud83c\udde7\ud83c\uddef", code: "229" },
    Réunion: { flag: "\ud83c\uddf7\ud83c\uddea", code: "262" },
    "Western Sahara": { flag: "\ud83c\uddea\ud83c\udded", code: "212" },
    Cuba: { flag: "\ud83c\udde8\ud83c\uddfa", code: "53" },
    Montenegro: { flag: "\ud83c\uddf2\ud83c\uddea", code: "382" },
    "Saint Kitts and Nevis": { flag: "", code: "1" },
    "Congo- Democratic Republic of the": { flag: "", code: "243" },
    Mayotte: { flag: "\ud83c\uddfe\ud83c\uddf9", code: "269" },
    "Holy See (Vatican City State)": { flag: "", code: "39" },
    China: { flag: "\ud83c\udde8\ud83c\uddf3", code: "86" },
    Armenia: { flag: "\ud83c\udde6\ud83c\uddf2", code: "374" },
    "Timor-Leste": { flag: "\ud83c\uddf9\ud83c\uddf1", code: "670" },
    "Dominican Republic": { flag: "\ud83c\udde9\ud83c\uddf4", code: "1" },
    Mongolia: { flag: "\ud83c\uddf2\ud83c\uddf3", code: "976" },
    Nigeria: { flag: "\ud83c\uddf3\ud83c\uddec", code: "234" },
    Ukraine: { flag: "\ud83c\uddfa\ud83c\udde6", code: "380" },
    Ghana: { flag: "\ud83c\uddec\ud83c\udded", code: "233" },
    Tonga: { flag: "\ud83c\uddf9\ud83c\uddf4", code: "676" },
    Finland: { flag: "\ud83c\uddeb\ud83c\uddee", code: "358" },
    Libya: { flag: "\ud83c\uddf1\ud83c\uddfe", code: "218" },
    Somaliland: { flag: "", code: "252" },
    "Cayman Islands": { flag: "\ud83c\uddf0\ud83c\uddfe", code: "1" },
    "Central African Republic": {
        flag: "\ud83c\udde8\ud83c\uddeb",
        code: "236"
    },
    "Tristan da Cunha": { flag: "", code: "290" },
    Mauritius: { flag: "\ud83c\uddf2\ud83c\uddfa", code: "230" },
    Tajikistan: { flag: "\ud83c\uddf9\ud83c\uddef", code: "992" },
    Liechtenstein: { flag: "\ud83c\uddf1\ud83c\uddee", code: "423" },
    Australia: { flag: "\ud83c\udde6\ud83c\uddfa", code: "61" },
    Mali: { flag: "\ud83c\uddf2\ud83c\uddf1", code: "223" },
    Sweden: { flag: "\ud83c\uddf8\ud83c\uddea", code: "46" },
    Poland: { flag: "\ud83c\uddf5\ud83c\uddf1", code: "48" },
    Russia: { flag: "\ud83c\uddf7\ud83c\uddfa", code: "7" },
    "United States": { flag: "\ud83c\uddfa\ud83c\uddf8", code: "1" },
    Romania: { flag: "\ud83c\uddf7\ud83c\uddf4", code: "40" },
    Angola: { flag: "\ud83c\udde6\ud83c\uddf4", code: "244" },
    Chad: { flag: "\ud83c\uddf9\ud83c\udde9", code: "235" },
    "South Africa": { flag: "\ud83c\uddff\ud83c\udde6", code: "27" },
    Tokelau: { flag: "\ud83c\uddf9\ud83c\uddf0", code: "690" },
    Nicaragua: { flag: "\ud83c\uddf3\ud83c\uddee", code: "505" },
    "Brunei Darussalam": { flag: "", code: "673" },
    Qatar: { flag: "\ud83c\uddf6\ud83c\udde6", code: "974" },
    Malaysia: { flag: "\ud83c\uddf2\ud83c\uddfe", code: "60" },
    Austria: { flag: "\ud83c\udde6\ud83c\uddf9", code: "43" },
    Mozambique: { flag: "\ud83c\uddf2\ud83c\uddff", code: "258" },
    Uganda: { flag: "\ud83c\uddfa\ud83c\uddec", code: "256" },
    "Kyrgyz Republic": { flag: "", code: "996" },
    "Canary Islands": { flag: "\ud83c\uddee\ud83c\udde8", code: "34" },
    Hungary: { flag: "\ud83c\udded\ud83c\uddfa", code: "36" },
    Niger: { flag: "\ud83c\uddf3\ud83c\uddea", code: "227" },
    "Isle of Man": { flag: "\ud83c\uddee\ud83c\uddf2", code: "44" },
    Brazil: { flag: "\ud83c\udde7\ud83c\uddf7", code: "55" },
    "Falkland Islands": { flag: "\ud83c\uddeb\ud83c\uddf0", code: "500" },
    "Faroe Islands": { flag: "\ud83c\uddeb\ud83c\uddf4", code: "298" },
    Guinea: { flag: "\ud83c\uddec\ud83c\uddf3", code: "224" },
    "Cocos (Keeling) Island": { flag: "", code: "61" },
    "Costa Rica": { flag: "\ud83c\udde8\ud83c\uddf7", code: "506" },
    Luxembourg: { flag: "\ud83c\uddf1\ud83c\uddfa", code: "352" },
    "Cape Verde": { flag: "\ud83c\udde8\ud83c\uddfb", code: "238" },
    Bahamas: { flag: "\ud83c\udde7\ud83c\uddf8", code: "1" },
    Gibraltar: { flag: "\ud83c\uddec\ud83c\uddee", code: "350" },
    Ireland: { flag: "\ud83c\uddee\ud83c\uddea", code: "353" },
    Pakistan: { flag: "\ud83c\uddf5\ud83c\uddf0", code: "92" },
    Palau: { flag: "\ud83c\uddf5\ud83c\uddfc", code: "680" },
    "Korea- Republic of": { flag: "", code: "82" },
    Ecuador: { flag: "\ud83c\uddea\ud83c\udde8", code: "593" },
    "Czech Republic": { flag: "\ud83c\udde8\ud83c\uddff", code: "420" },
    "Viet Nam": { flag: "", code: "84" },
    Belarus: { flag: "\ud83c\udde7\ud83c\uddfe", code: "375" },
    Iran: { flag: "\ud83c\uddee\ud83c\uddf7", code: "98" },
    Algeria: { flag: "\ud83c\udde9\ud83c\uddff", code: "213" },
    Slovenia: { flag: "\ud83c\uddf8\ud83c\uddee", code: "386" },
    "El Salvador": { flag: "\ud83c\uddf8\ud83c\uddfb", code: "503" },
    Tuvalu: { flag: "\ud83c\uddf9\ud83c\uddfb", code: "688" },
    "Saint Pierre and Miquelon": { flag: "", code: "508" },
    "Marshall Islands": { flag: "\ud83c\uddf2\ud83c\udded", code: "692" },
    Chile: { flag: "\ud83c\udde8\ud83c\uddf1", code: "56" },
    "Puerto Rico": { flag: "\ud83c\uddf5\ud83c\uddf7", code: "1" },
    Belgium: { flag: "\ud83c\udde7\ud83c\uddea", code: "32" },
    Kiribati: { flag: "\ud83c\uddf0\ud83c\uddee", code: "686" },
    Haiti: { flag: "\ud83c\udded\ud83c\uddf9", code: "509" },
    Belize: { flag: "\ud83c\udde7\ud83c\uddff", code: "501" },
    "Hong Kong": { flag: "\ud83c\udded\ud83c\uddf0", code: "852" },
    "Sierra Leone": { flag: "\ud83c\uddf8\ud83c\uddf1", code: "232" },
    Georgia: { flag: "\ud83c\uddec\ud83c\uddea", code: "995" },
    Gambia: { flag: "\ud83c\uddec\ud83c\uddf2", code: "220" },
    "C\u00f4te D'Ivoire": { flag: "", code: "225" },
    Moldova: { flag: "\ud83c\uddf2\ud83c\udde9", code: "373" },
    Morocco: { flag: "\ud83c\uddf2\ud83c\udde6", code: "212" },
    Croatia: { flag: "\ud83c\udded\ud83c\uddf7", code: "385" },
    Micronesia: { flag: "\ud83c\uddeb\ud83c\uddf2", code: "691" },
    Guernsey: { flag: "\ud83c\uddec\ud83c\uddec", code: "44" },
    Thailand: { flag: "\ud83c\uddf9\ud83c\udded", code: "66" },
    Namibia: { flag: "\ud83c\uddf3\ud83c\udde6", code: "264" },
    Grenada: { flag: "\ud83c\uddec\ud83c\udde9", code: "1" },
    "Wallis and Futuna Islands": { flag: "", code: "681" },
    Iraq: { flag: "\ud83c\uddee\ud83c\uddf6", code: "964" },
    Portugal: { flag: "\ud83c\uddf5\ud83c\uddf9", code: "351" },
    Estonia: { flag: "\ud83c\uddea\ud83c\uddea", code: "372" },
    Uruguay: { flag: "\ud83c\uddfa\ud83c\uddfe", code: "598" },
    "Virgin Islands- British": { flag: "", code: "1" },
    Mexico: { flag: "\ud83c\uddf2\ud83c\uddfd", code: "52" },
    Lebanon: { flag: "\ud83c\uddf1\ud83c\udde7", code: "961" },
    "Russian Federation": { flag: "", code: "7" },
    "Svalbard and Jan Mayen": { flag: "", code: "47" },
    Uzbekistan: { flag: "\ud83c\uddfa\ud83c\uddff", code: "998" },
    Tunisia: { flag: "\ud83c\uddf9\ud83c\uddf3", code: "216" },
    Djibouti: { flag: "\ud83c\udde9\ud83c\uddef", code: "253" },
    Greenland: { flag: "\ud83c\uddec\ud83c\uddf1", code: "299" },
    "Antigua and Barbuda": { flag: "", code: "1" },
    Spain: { flag: "\ud83c\uddea\ud83c\uddf8", code: "34" },
    Colombia: { flag: "\ud83c\udde8\ud83c\uddf4", code: "57" },
    Burundi: { flag: "\ud83c\udde7\ud83c\uddee", code: "257" },
    Taiwan: { flag: "\ud83c\uddf9\ud83c\uddfc", code: "886" },
    Fiji: { flag: "\ud83c\uddeb\ud83c\uddef", code: "679" },
    Barbados: { flag: "\ud83c\udde7\ud83c\udde7", code: "1" },
    Madagascar: { flag: "\ud83c\uddf2\ud83c\uddec", code: "261" },
    Italy: { flag: "\ud83c\uddee\ud83c\uddf9", code: "39" },
    Bhutan: { flag: "\ud83c\udde7\ud83c\uddf9", code: "975" },
    Sudan: { flag: "\ud83c\uddf8\ud83c\udde9", code: "249" },
    Nepal: { flag: "\ud83c\uddf3\ud83c\uddf5", code: "977" },
    Malta: { flag: "\ud83c\uddf2\ud83c\uddf9", code: "356" },
    Netherlands: { flag: "\ud83c\uddf3\ud83c\uddf1", code: "31" },
    Suriname: { flag: "\ud83c\uddf8\ud83c\uddf7", code: "597" },
    Anguilla: { flag: "\ud83c\udde6\ud83c\uddee", code: "1" },
    Venezuela: { flag: "\ud83c\uddfb\ud83c\uddea", code: "58" },
    "Netherlands Antilles": { flag: "", code: "599" },
    "Aland Islands": { flag: "", code: "358" },
    Israel: { flag: "\ud83c\uddee\ud83c\uddf1", code: "972" },
    Indonesia: { flag: "\ud83c\uddee\ud83c\udde9", code: "62" },
    Iceland: { flag: "\ud83c\uddee\ud83c\uddf8", code: "354" },
    Zambia: { flag: "\ud83c\uddff\ud83c\uddf2", code: "260" },
    Senegal: { flag: "\ud83c\uddf8\ud83c\uddf3", code: "221" },
    "Papua New Guinea": { flag: "\ud83c\uddf5\ud83c\uddec", code: "675" },
    "Trinidad and Tobago": { flag: "", code: "1" },
    Zimbabwe: { flag: "\ud83c\uddff\ud83c\uddfc", code: "263" },
    Germany: { flag: "\ud83c\udde9\ud83c\uddea", code: "49" },
    Vanuatu: { flag: "\ud83c\uddfb\ud83c\uddfa", code: "678" },
    Denmark: { flag: "\ud83c\udde9\ud83c\uddf0", code: "45" },
    Kazakhstan: { flag: "\ud83c\uddf0\ud83c\uddff", code: "7" },
    Philippines: { flag: "\ud83c\uddf5\ud83c\udded", code: "63" },
    "Cyprus- Turkish Republic of Northern": { flag: "", code: "90" },
    Eritrea: { flag: "\ud83c\uddea\ud83c\uddf7", code: "291" },
    "British Indian Ocean Territory": {
        flag: "\ud83c\uddee\ud83c\uddf4",
        code: "246"
    },
    Montserrat: { flag: "\ud83c\uddf2\ud83c\uddf8", code: "1" },
    "New Caledonia": { flag: "\ud83c\uddf3\ud83c\udde8", code: "687" },
    Macedonia: { flag: "\ud83c\uddf2\ud83c\uddf0", code: "389" },
    "Sri Lanka": { flag: "\ud83c\uddf1\ud83c\uddf0", code: "94" },
    Latvia: { flag: "\ud83c\uddf1\ud83c\uddfb", code: "371" },
    Guyana: { flag: "\ud83c\uddec\ud83c\uddfe", code: "592" },
    Syria: { flag: "\ud83c\uddf8\ud83c\uddfe", code: "963" },
    Guadeloupe: { flag: "\ud83c\uddec\ud83c\uddf5", code: "590" },
    Honduras: { flag: "\ud83c\udded\ud83c\uddf3", code: "504" },
    Myanmar: { flag: "\ud83c\uddf2\ud83c\uddf2", code: "95" },
    "Equatorial Guinea": { flag: "\ud83c\uddec\ud83c\uddf6", code: "240" },
    Egypt: { flag: "\ud83c\uddea\ud83c\uddec", code: "20" },
    "French Southern and Antarctic Lands": { flag: "", code: "262" },
    Singapore: { flag: "\ud83c\uddf8\ud83c\uddec", code: "65" },
    Serbia: { flag: "\ud83c\uddf7\ud83c\uddf8", code: "381" },
    Botswana: { flag: "\ud83c\udde7\ud83c\uddfc", code: "267" },
    "United Kingdom": { flag: "\ud83c\uddec\ud83c\udde7", code: "44" },
    Antarctica: { flag: "\ud83c\udde6\ud83c\uddf6", code: "672" },
    Congo: { flag: "", code: "242" },
    Greece: { flag: "\ud83c\uddec\ud83c\uddf7", code: "30" },
    Paraguay: { flag: "\ud83c\uddf5\ud83c\uddfe", code: "595" },
    "French Guiana": { flag: "\ud83c\uddec\ud83c\uddeb", code: "594" },
    Comoros: { flag: "\ud83c\uddf0\ud83c\uddf2", code: "269" }
};

/*

Takes props:
- autofocus boolean (defualts to false)
- countryName string (defaults to "United States")
- countryCode string (defaults to "1")
- countryFlag string (defualts to "🇺🇸")
- number string (defualts to "")
- callback function (state) => {}

*/

class PhoneNumberInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            countryName: props.countryName || "United States",
            countryCode: props.countryCode || "1",
            countryFlag: props.countryFlag || "🇺🇸",
            number: normalizePhone(props.number, "") || "",
            isChoosingCountry: false
        };
        this.handleCountryChange = this.handleCountryChange.bind(this);
        this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);
        this.handleCountryClick = this.handleCountryClick.bind(this);
    }

    handleCountryChange(countryIndex) {
        const country = countryList[countryIndex];

        this.setState(prevState => {
            return {
                ...prevState,
                countryName: country,
                countryCode: countryData[country].code,
                countryFlag: countryData[country].flag,
                // isChoosingCountry: false
            };
        });

        if (this.props.callback) {
            this.props.callback(this.state);
        }
    }

    handlePhoneNumberChange(number) {
        const normalizedNumber = normalizePhone(number, this.state.number);
        this.setState(prevState => {
            if (this.props.callback) {
                this.props.callback({
                    ...prevState,
                    number: normalizedNumber
                });
            }
            return {
                ...prevState,
                number: normalizedNumber
            };
        });
    }

    handleCountryClick() {
        this.setState(prevState => {
            return {
                ...prevState,
                isChoosingCountry: true
            };
        });
    }

    render() {

        const countryItems = [];
        for (let i = 0; i < countryList.length; i++) {
            const country = countryList[i];
            if (countryData.hasOwnProperty(country)) {
                countryItems.push(
                    <Picker.Item
                        key={"countryPickerItem"+i}
                        label={countryData[country].flag + " " + country}
                        value={country}/>
                );
            }
        }

        return (
            <View style={styles.wrapper}>

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.isChoosingCountry}>
                    <View style={styles.modalWrapper}>
                        <Text style={styles.modalTitle}>
                            Choose your country
                        </Text>

                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={this.state.countryName}
                                onValueChange={(itemValue, itemIndex) => this.handleCountryChange(itemIndex)}>
                                {countryItems}
                            </Picker>
                        </View>

                        <Button 
                            title="Done"
                            primary={true}
                            onPress={() => {
                                this.setState((prevState) => {
                                    return {
                                        ...prevState,
                                        isChoosingCountry: false
                                    }
                                })
                            }}/>

                    </View>
                </Modal>
                
                <TouchableWithoutFeedback
                    style={styles.countryCode}
                    onPress={() => this.handleCountryClick()}
                >
                    <View style={{
                        padding: (this.state.isChoosingCountry) ? 10 : 0
                    }}>
                        {!this.state.isChoosingCountry && (
                            <Text style={styles.countryCodeText}>
                                {this.state.countryFlag} +{this.state.countryCode}
                            </Text>
                        )}
                        <View style={[
                            styles.loadingWrapper,
                            {
                                display: (this.state.isChoosingCountry) ? "flex" : "none"
                            }
                        ]}>
                            <LoadingCircle size={20} color={"purple"}/>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.divider} />
                <TextInput
                    style={styles.phoneNumber}
                    onChangeText={text => this.handlePhoneNumberChange(text)}
                    value={this.state.number}
                    keyboardType={"number-pad"}
                    placeholder={"### ### ####"}
                    maxLength={12}
                    autoFocus={this.props.autoFocus || false}
                />

            </View>
        );
    }
}

PhoneNumberInput.propTypes = {
    autofocus: PropTypes.bool,
    countryName: PropTypes.string,
    countryCode: PropTypes.string,
    countryFlag: PropTypes.string,
    number: PropTypes.string,
    callback: PropTypes.func
};

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: "row",
        alignItems: "center",
        height: 60,
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        borderRadius: 5
    },
    divider: {
        width: 1,
        height: 60,
        backgroundColor: "rgba(0,0,0,0.1)"
    },
    countryCode: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingRight: 10,
        height: 60,
        backgroundColor: colors.white
    },
    countryCodeText: {
        padding: 10,
        fontSize: 22,
        color: colors.nearBlack
    },
    phoneNumber: {
        flex: 3,
        height: 60,
        padding: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 22,
        color: colors.nearBlack
    },
    modalWrapper: {
        flex: 1,
        padding: 40,
        flexDirection: "column",
        justifyContent: "space-around",
        
    },
    modalCardWrapper: {},
    modalTitle: {
        fontSize: 22,
        fontWeight: "600",
        textAlign: "center",
        color: colors.nearBlack
    },
    pickerWrapper: {
        backgroundColor: colors.white,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    }
});

export default PhoneNumberInput;
