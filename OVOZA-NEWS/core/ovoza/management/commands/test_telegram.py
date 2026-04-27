import requests
from django.core.management.base import BaseCommand
from django.conf import settings
from ovoza.models import TelegramSettings


class Command(BaseCommand):
    help = 'Telegram bot va kanal ulanishini tekshiradi'

    def handle(self, *args, **options):
        token = settings.TELEGRAM_BOT_TOKEN
        if not token:
            self.stderr.write(self.style.ERROR('TELEGRAM_BOT_TOKEN .env da topilmadi!'))
            return

        self.stdout.write(f'Token: {token[:20]}...')

        # 1. Bot ma'lumotlarini tekshir
        self.stdout.write('\n[1] Bot tekshirilmoqda...')
        try:
            r = requests.get(f'https://api.telegram.org/bot{token}/getMe', timeout=10)
            data = r.json()
            if data.get('ok'):
                bot = data['result']
                self.stdout.write(self.style.SUCCESS(
                    f"    Bot: @{bot['username']} ({bot['first_name']})"
                ))
            else:
                self.stderr.write(self.style.ERROR(f"    Bot xatosi: {data}"))
                return
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'    Ulanish xatosi: {e}'))
            return

        # 2. TelegramSettings tekshir
        self.stdout.write('\n[2] Sozlamalar tekshirilmoqda...')
        cfg = TelegramSettings.objects.filter(is_active=True).first()
        if not cfg:
            self.stderr.write(self.style.ERROR(
                '    TelegramSettings topilmadi!\n'
                '    Admin → Telegram sozlamalari → + Qo\'shish'
            ))
            return
        self.stdout.write(self.style.SUCCESS(f'    Kanal: {cfg.channel_id}'))

        # 3. Test xabar yuborish
        self.stdout.write('\n[3] Test xabar yuborilmoqda...')
        try:
            r = requests.post(
                f'https://api.telegram.org/bot{token}/sendMessage',
                json={
                    'chat_id': cfg.channel_id,
                    'text': '✅ <b>Ovoza test xabari</b>\n\nBot muvaffaqiyatli ulandi!',
                    'parse_mode': 'HTML',
                },
                timeout=10,
            )
            data = r.json()
            if data.get('ok'):
                self.stdout.write(self.style.SUCCESS('    Xabar muvaffaqiyatli yuborildi!'))
            else:
                self.stderr.write(self.style.ERROR(
                    f"    Xabar yuborishda xato:\n    {data.get('description', data)}"
                ))
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'    Xato: {e}'))