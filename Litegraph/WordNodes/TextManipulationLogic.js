export const TextManipulationLogic = [
    {
        title: "Alphabet-Countdown",
        description: "Ersetze jeden Buchstaben\n" +
                     "durch den vorherigen im\n" +
                     "Alphabet.\nA wird zu Z, B zu A usw.",
        logic: (text) => {
            return text.replace(/[a-zA-Z]/g, (c) => {
                if (c === "a") return "z";
                if (c === "A") return "Z";
                return String.fromCharCode(c.charCodeAt(0) - 1);
            });
        }
    },
    {
        title: "Alphabetischer_Sprung",
        description: "Ersetze jeden Buchstaben\n" +
                     "durch den übernächsten im\n" +
                     "Alphabet. Y und Z sind dann\n" +
                     "wieder A und B.",
        logic: (text) => text.replace(/[a-zA-Z]/g, (c) => {
            const base = c === c.toLowerCase() ? 97 : 65;
            return String.fromCharCode(((c.charCodeAt(0) - base + 2) % 26) + base);
        })
    },
    {
        title: "Buchstaben-Sprung",
        description: "Überspringe jeden zweiten\n" +
                     "Buchstaben. \"SPIEL\" wird\n" +
                     "so zu \"SIL\".",
        logic: (text) => text.split("").filter((_, i) => i % 2 === 0).join("")
    },
    {
        title: "Buchstaben-Überlappung",
        description: "Folgen zwei gleiche Buchstaben\n" +
                     "aufeinander, lasse den\n" +
                     "zweiten weg. Z.B. wird\n" +
                     "\"SCHWIMMEN\" zu \"SCHWIMEN\".",
        logic: (text) => text.replace(/(.)\1/g, "$1")
    },
    {
        title: "Buchstabenballett",
        description: "Nimm immer drei aufeinander\n" +
                     "folgende Buchstaben und\n" +
                     "rutsche sie zyklisch um 1\n" +
                     "weiter.",
        logic: (text) => text.replace(/(...)/g, (match) => match[1] + match[2] + match[0])
    },
    {
        title: "Buchstabenwechsel",
        description: "Nimm immer zwei aufeinander\n" +
                     "folgende Buchstaben und\n" +
                     "tausche ihren Platz.",
        logic: (text) => text.replace(/(.)(.)/g, "$2$1")
    },
    {
        title: "Doppelt_hält_besser",
        description: "Jeder Buchstabe wird zweimal\n" +
                     "ausgegeben. Z.B. wird\n" +
                     "\"SCHWIMMEN\" zu\n" +
                     "\"SSCCHHWWIIMMMMEENN\".",
        logic: (text) => text.replace(/./g, "$&$&")
    },
    {
        title: "Kn_Vkl_n_mnm_Txt",
        description: "Lasse alle Vokale (A, E, I,\n" +
                     "O, U) weg.",
        logic: (text) => text.replace(/[AEIOUaeiou]/g, "")
    },
    {
        title: "Konsonanten_verdoppeln",
        description: "Verdopple jeden Konsonanten\n" +
                     "in einem Wort. Zum Beispiel\n" +
                     "wird \"SPIEL\" zu \"SSPPIELL\".",
        logic: (text) => text.replace(/[^AEIOUaeiou\s]/g, "$&$&")
    },
    {
        title: "Rückwärtslesen",
        description: "Kehrt den eingegebenen\n" +
                     "Text um.",
        logic: (text) => text.split("").reverse().join("")
    },
    {
        title: "Vokal-Verwandlung",
        description: "Mache aus jedem A, I, O und U\n" +
                     "ein E.",
        logic: (text) => {
            return text
                .replace(/[AIOU]/g, "E") // Großbuchstaben (A, I, U)
                .replace(/[aiou]/g, "e"); // Kleinbuchstaben (a, i, u)
        }
    },
    {
        title: "Vokalium",
        description: "Tausche jeden Vokal im Wort\n" +
                     "mit dem vorherigen Vokal im\n" +
                     "Alphabet aus. U wird zu O,\n" +
                     "O zu I, I zu E, E zu A usw.",
        logic: (text) => text.replace(/[AEIOUaeiou]/g, (c) => {
            const vowelsUpper = "AEIOU"; // Zyklus für Großbuchstaben
            const vowelsLower = "aeiou"; // Zyklus für Kleinbuchstaben
            const isUpperCase = c === c.toUpperCase();
            const vowels = isUpperCase ? vowelsUpper : vowelsLower;
            const index = vowels.indexOf(c);
            return vowels[(index - 1 + vowels.length) % vowels.length];
        })
    },
    {
        title: "Vokaltanz",
        description: "Tausche jeden Vokal \n" +
                     "mit dem folgenden Vokal im\n" +
                     "Alphabet aus. A wird zu E,\n" +
                     "E zu I, I zu O, O zu U, U zu A",
        logic: (text) => text.replace(/[AEIOUaeiou]/g, (c) => {
            const vowelsUpper = "AEIOU"; // Zyklus für Großbuchstaben
            const vowelsLower = "aeiou"; // Zyklus für Kleinbuchstaben
            const isUpperCase = c === c.toUpperCase();
            const vowels = isUpperCase ? vowelsUpper : vowelsLower;
            const index = vowels.indexOf(c);
            return vowels[(index + 1 + vowels.length) % vowels.length];
        })
    },
    {
        title: "Vokalwechsel",
        description: "Mache aus jeden E abwechselnd\n" +
                     "A, I, O und U.",
        logic: (text) => {
            const vowels = ["A", "I", "O", "U"];
            let index = 0;
            return text.replace(/E/g, () => vowels[index++ % vowels.length]);
        }
    },
    {
        title: "Vorwärts_Rückwärts",
        description: "Nimm immer abwechselnd ein\n" +
                     "Wort vom Anfang und Ende\n" +
                     "des Textes.",
        logic: (text) => {
            const words = text.split(/\s+/);
            const result = [];
            while (words.length) {
                result.push(words.shift());
                if (words.length) result.push(words.pop());
            }
            return result.join(" ");
        }
    },
    {
        title: "Platzhalter",
        description:"",
        logic: (text) => {
            return "";
        }
    },
];