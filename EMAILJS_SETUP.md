# EmailJS Integration Guide

This guide will help you set up EmailJS to receive contact form submissions via email.

## Step 1: Create an EmailJS Account

1. Visit [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Set Up Email Service

1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your chosen provider
5. Name your service (e.g., "contact-form-service")
6. Copy the **Service ID** - you'll need this for the environment variables

## Step 3: Create Email Template

1. Go to "Email Templates" in your EmailJS dashboard
2. Click "Create New Template"
3. Use the following template structure:

```html
Subject: New Contact Form Submission - {{project_type}}

From: {{from_name}} ({{from_email}})
Phone: {{phone}}
Company: {{company}}
Project Type: {{project_type}}
Budget: {{budget}}

Message:
{{message}}

---
This email was sent from your website contact form.
```

4. Save the template
5. Copy the **Template ID** - you'll need this for the environment variables

## Step 4: Get Your Public Key

1. Go to "Account" → "General" in your EmailJS dashboard
2. Find your **Public Key** (it looks like a long string of characters)
3. Copy this key

## Step 5: Update Environment Variables

Update your `.env.local` file with the values you copied:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_actual_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_actual_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_actual_public_key
```

## Step 6: Test the Integration

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Visit your contact form at `http://localhost:3001/contact-us`

3. Fill out the form and submit it

4. Check your email - you should receive the contact form submission

## Troubleshooting

### Email not being sent?
- Check that all environment variables are set correctly
- Verify your EmailJS service is properly configured
- Check the browser console for any error messages
- Ensure your EmailJS account is verified

### Getting "EmailJS is not properly configured" error?
- Make sure all three environment variables are set
- Check for typos in the environment variable names
- Ensure there are no extra spaces in the values

### Emails going to spam?
- Add your sending email to your contacts
- Configure proper SPF/DKIM records for your domain
- Use a professional email address instead of personal Gmail

## Features

- **Automatic fallback**: If EmailJS is not configured, the form will fall back to the existing API method
- **Client-side validation**: All form validation happens before submission
- **Loading states**: Users see loading indicators during submission
- **Error handling**: Clear error messages if something goes wrong
- **Success feedback**: Users get confirmation when the email is sent

## Security Notes

- EmailJS is client-side safe - your private keys are not exposed
- The public key is safe to use in the browser
- All form data is validated before sending
- Rate limiting is handled by EmailJS

## Next Steps

- Consider upgrading to EmailJS paid plan for higher limits
- Set up additional email templates for different form types
- Add email notifications for form administrators
- Implement email confirmation for users who submit forms