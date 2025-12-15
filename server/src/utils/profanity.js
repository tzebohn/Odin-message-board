import leoProfanity from "leo-profanity"

/**
 * Initialize filter and load defaults words from leo-profanity.
 */
leoProfanity.loadDictionary()
const dictionary = leoProfanity.list()

/**
 * Cleans up username string for easier future valdiation checks.
 * 
 * @param {string} str - The original username input.
 */
function normalizeTextForDetection (str = "") {
    let s = String(str).toLowerCase()

    // Replace common bypass letters
    s = s.replace(/[0]/g, "o")
        .replace(/[1|!|l]/g, "i")
        .replace(/[3]/g, "e")
        .replace(/[4]/g, "h")
        .replace(/[5]/g, "s")
        .replace(/[7]/g, "t")
        .replace(/[@]/g, "a")
        .replace(/[$]/g, "s")

    // Remove common non-letter characters (preserve spaces)
    s = s.replace(/[^\p{L}\p{N}\s]/gu, "")

    s = s.replace(/\s+/g, " ").trim()

    return s
}

/**
 * Checks if the username contains profanity.
 * 
 * We normalize before checking, to catch other variants of bad words.
 * @param {string} text - The user's input: username & message.
 * @returns {boolean} - True if string contains bad word. Otherwise, false.
 */
export function containsProfanity (text) {
    const normalized = normalizeTextForDetection(text)
    return leoProfanity.check(normalized)
}


/**
 * Censors the original string (replaces inappropriate words with astericks).
 * 
 * We return the censored version for sending to clients.
 * 
 * @param {string} text - The raw user message input.
 * @returns {string} - A filtered string that censors inappropriate words.
 */
export function censorText(text) {
    if (!text) return text

    const { normalized, indexMap } = buildNormalizedMap(text)

    let censoredArray = text.split("")

    /**
     * For Loop cycle: 
     * 
     * Step 1: Get current badword from leo-profanity.
     * 
     * Step 2: Find the first occurence of badword in the string.
     * 
     * Step 3: Replace the letters with *
     * 
     * Step 4: Find the next occurences of the badword if they exist.
     * 
     * Step 5: Go to the next badword from leo-profanity. 
     */
    for (const badWord of dictionary) {
        // Get the starting index of where badword appears
        let startIndex = normalized.indexOf(badWord)

        while (startIndex !== -1) {
            const endIndex = startIndex + badWord.length - 1

            // Map normalized indices back to original indices
            for (let i = startIndex; i <= endIndex; i++) {
                const originalIndex = indexMap[i]
                censoredArray[originalIndex] = "*"
            }

            // Look for next occurrence
            startIndex = normalized.indexOf(badWord, startIndex + 1)
        }
    }

    return censoredArray.join("")
}

/**
 * Normalizes the given character.
 * 
 * Ignores special characters.
 * @param {*} char 
 * @returns 
 */
function normalizeChar(char) {
    // Unicode normalize (é → e, ñ → n)
    const base = char
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()

    // Map common bypass characters, with english letter
    const leetMap = {
        "1": "i",
        "!": "i",
        "3": "e",
        "4": "a",
        "@": "a",
        "5": "s",
        "$": "s",
        "7": "t",
        "0": "o",
        "8": "b"
    }

    if (leetMap[base]) return leetMap[base]

    // Only allow letters a–z
    if (base >= "a" && base <= "z") return base

    // Everything else contributes nothing
    return null
}

/**
 * Builds a organized map of each character in the string.
 * @param {string} text - The raw original message input from user. 
 * @returns {Map}   - map.normalized is the original string, without the spaces and special characters.
 *                  - map.indexMap is an array of indices that maps each letter in map.normalized with the original string.
 */
function buildNormalizedMap(text) {
    let normalized = ""
    const indexMap = [] // normalizedIndex -> originalIndex

    /**
     * Normalizes each character in message text.
     * Builds an indexMap to keep track of indices of valid letters.
     * 
     * Indices skip over spaces and nonvalidate characters
     */
    for (let i = 0; i < text.length; i++) {
        const normalizedChar = normalizeChar(text[i]) 

        if (normalizedChar) {
            indexMap.push(i)
            normalized += normalizedChar
        }
    }

    return { normalized, indexMap }
}