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
        title: "Alphabet-Sprung",
        description: "Erhöhe jeden Buchstaben um 2\n" +
                     "Positionen im Alphabet.",
        logic: (text) => {
            const step = 2;
            return text.replace(/[a-zA-Z]/g, (c) => {
                const base = c === c.toLowerCase() ? 97 : 65;
                return String.fromCharCode(((c.charCodeAt(0) - base + step) % 26) + base);
            });
        }
    },

    {
        title: "Rückwärtslesen",
        description: "Kehrt den eingegebenen\n" +
                     "Text um.",
        logic: (text) => text.split("").reverse().join("")
    },

    {
        title: "Vokal-Verwandlung",
        description: "Mache aus jeden A, I und U\n" +
                     "ein E.",
                     logic: (text) => {
                        return text
                            .replace(/[AIU]/g, "E") // Großbuchstaben (A, I, U)
                            .replace(/[aiu]/g, "e"); // Kleinbuchstaben (a, i, u)
                    }
    },

    {
        title: "Kn Vkl n mnm Txt",
        description: "Lasse alle Vokale (A, E, I,\n" +
                     "O, U) weg.",
        logic: (text) => text.replace(/[AEIOUaeiou]/g, "")
    },

    {
        title: "Buchstabenwechsel",
        description: "Nimm immer zwei aufeinander\n" +
                     "folgende Buchstaben und\n" +
                     "tausche ihren Platz.",
        logic: (text) => text.replace(/(.)(.)/g, "$2$1")
    },

    {
        title: "Buchstaben-Sprung",
        description: "Überspringe jeden zweiten\n" +
                     "Buchstaben. \"SPIEL\" wird\n" +
                     "so zu \"SIL\".",
        logic: (text) => text.split("").filter((_, i) => i % 2 === 0).join("")
    },

    {
        title: "Alphabetischer Sprung",
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
        title: "Buchstaben-Überlappung",
        description: "Folgen zwei gleiche Buchstaben\n" +
                     "aufeinander, lasse den\n" +
                     "zweiten weg. Z.B. wird\n" +
                     "\"SCHWIMMEN\" zu \"SCHWIMEN\".",
        logic: (text) => text.replace(/(.)\1/g, "$1")
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
        title: "Buchstabenballet",
        description: "Nimm immer drei aufeinander\n" +
                     "folgende Buchstaben und\n" +
                     "rutsche sie zyklisch um 1\n" +
                     "weiter.",
        logic: (text) => text.replace(/(...)/g, (match) => match[1] + match[2] + match[0])
    },

    {
        title: "Vokaltanz",
        description: "Tausche jeden Vokal im Wort\n" +
                     "mit dem folgenden Vokal im\n" +
                     "Alphabet aus. A wird zu E,\n" +
                     "E zu I, I zu O, O zu U und\n" +
                     "U zu A. Zum Beispiel wird\n" +
                     "\"KATZE\" zu \"KETZI\".",
        logic: (text) => text.replace(/[AEIOUaeiou]/g, (c) => {
            const vowels = "AEIOUaeiou";
            const index = vowels.indexOf(c);
            return vowels[(index + 2) % 10];
        })
    },

    {
        title: "Vokalium",
        description: "Tausche jeden Vokal im Wort\n" +
                     "mit dem vorherigen Vokal im\n" +
                     "Alphabet aus. U wird zu O,\n" +
                     "O zu I, I zu E, E zu A und\n" +
                     "A zu U.",
        logic: (text) => text.replace(/[AEIOUaeiou]/g, (c) => {
            const vowels = "UOAIEuoaie";
            const index = vowels.indexOf(c);
            return vowels[(index + 10 - 2) % 10];
        })
    },

    {
        title: "Konsonanten verdoppeln",
        description: "Verdopple jeden Konsonanten\n" +
                     "in einem Wort. Zum Beispiel\n" +
                     "wird \"SPIEL\" zu \"SSPPIELL\".",
        logic: (text) => text.replace(/[^AEIOUaeiou\s]/g, "$&$&")
    },

    {
        title: "Doppelt hält besser",
        description: "Jeder Buchstabe wird zweimal\n" +
                     "ausgegeben. Z.B. wird\n" +
                     "\"SCHWIMMEN\" zu\n" +
                     "\"SSCCHHWWIIMMMMEENN\".",
        logic: (text) => text.replace(/./g, "$&$&")
    },

    {
        title: "Vorwärts Rückwärts",
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
    }
];