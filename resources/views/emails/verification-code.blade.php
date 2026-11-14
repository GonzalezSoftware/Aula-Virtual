<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="font-family: 'Poppins', Arial, sans-serif; background-color: #F0F6FF; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <h2 style="color: #051C33; text-align: center;">Código de Verificación</h2>
        <p style="color: #4A607A; font-size: 14px;">Has solicitado registrarte en el Aula Virtual Académica. Utiliza el siguiente código de 6 dígitos para continuar:</p>
        <div style="background: #E3F2FD; color: #0066FF; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 12px; letter-spacing: 6px; margin: 24px 0;">
            {{ $code }}
        </div>
        <p style="color: #4A607A; font-size: 12px; text-align: center;">Si no solicitaste este registro, puedes ignorar este mensaje.</p>
    </div>
</body>
</html>