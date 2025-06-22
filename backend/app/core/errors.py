# Map of Pydantic error messages to French translations
TRANSLATIONS = {
    # Presence / Required
    "field required": "Ce champ est requis",
    "none is not an allowed value": "Ce champ ne peut pas être nul",
    "extra fields not permitted": "Champs supplémentaires non autorisés",
    # Type validation
    "value is not a valid boolean": "Valeur booléenne invalide",
    "value could not be parsed to a boolean": "Impossible d’interpréter la valeur comme un booléen",
    "value is not a valid integer": "Valeur entière invalide",
    "value is not a valid float": "Valeur décimale invalide",
    "value is not a valid decimal": "Valeur décimale invalide",
    "value is not a valid string": "Chaîne de caractères invalide",
    "value is not a valid list": "Liste invalide",
    "value is not a valid tuple": "Tuple invalide",
    "value is not a valid dict": "Dictionnaire invalide",
    "value is not a valid UUID": "UUID invalide",
    "value is not a valid URL": "URL invalide",
    "value is not a valid email address": "Adresse e-mail invalide",
    "value is not a valid date": "Date invalide",
    "value is not a valid datetime": "Date et heure invalides",
    "value is not a valid time": "Heure invalide",
    "value is not a valid enumeration member": "Valeur non valide pour ce champ",
    "str type expected": "Une chaîne de caractères est attendue",
    "int type expected": "Un entier est attendu",
    "float type expected": "Un nombre décimal est attendu",
    "bool type expected": "Un booléen est attendu",
    # Length constraints
    "ensure this value has at least": "La valeur doit contenir au moins X caractères",
    "ensure this value has at most": "La valeur doit contenir au maximum X caractères",
    "ensure this value has at least 1 items": "La liste doit contenir au moins 1 élément",
    "ensure this value has at most 5 items": "La liste doit contenir au maximum 5 éléments",
    # Value constraints
    "ensure this value is greater than": "La valeur doit être supérieure à X",
    "ensure this value is greater than or equal to": "La valeur doit être supérieure ou égale à X",
    "ensure this value is less than": "La valeur doit être inférieure à X",
    "ensure this value is less than or equal to": "La valeur doit être inférieure ou égale à X",
    "ensure this number is divisible by": "La valeur doit être divisible par X",
    # Regex / pattern matching
    "string does not match regex": "Le format de la chaîne est invalide",
    "string does not match pattern": "Le format de la chaîne ne correspond pas au motif requis",
    # Email / URL
    "invalid or missing URL scheme": "Le schéma d'URL est manquant ou invalide",
    "host is missing in URL": "L'hôte est manquant dans l'URL",
    "invalid email address": "Adresse e-mail invalide",
    # Datetime
    "invalid datetime format": "Format de date et heure invalide",
    "invalid date format": "Format de date invalide",
    "invalid time format": "Format de l'heure invalide",
    "invalid duration format": "Format de durée invalide",
    # Union / optional types
    "none is not an allowed value": "Ce champ ne peut pas être nul",
    "value is not a valid union type": "Valeur invalide pour ce type",
    "value is not a valid literal": "Valeur littérale non valide",
    # JSON / Parsing
    "value is not a valid JSON": "JSON invalide",
    "JSON decode error": "Erreur lors de l'analyse du JSON",
    # Misc
    "type is not iterable": "Ce type n'est pas itérable",
    "type is not a subclass of": "Ce type n'est pas une sous-classe valide",
    "value is not a valid path": "Chemin invalide",
}


def translate_error_message(msg: str) -> str:
    """
    Translate a known Pydantic error message into French
    using fuzzy substring matching.
    """
    for key, translation in TRANSLATIONS.items():
        if key in msg:
            return translation
    return msg
