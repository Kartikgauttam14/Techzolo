import emailjs from '@emailjs/browser';

export interface EmailJSConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

export interface ContactFormData {
  user_name: string;
  user_email: string;
  phone?: string;
  company?: string;
  project_type: string;
  budget?: string;
  message: string;
}

class EmailJSService {
  private config: EmailJSConfig;
  private initialized: boolean = false;

  constructor() {
    this.config = {
      serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
      templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
      publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
    };

    if (this.isConfigured()) {
      this.initialize();
    }
  }

  private initialize(): void {
    if (this.initialized) return;
    
    try {
      emailjs.init(this.config.publicKey);
      this.initialized = true;
      console.log('EmailJS initialized successfully');
    } catch (error) {
      console.error('Failed to initialize EmailJS:', error);
    }
  }

  private isConfigured(): boolean {
    return !!(
      this.config.serviceId &&
      this.config.templateId &&
      this.config.publicKey
    );
  }

  public async sendContactEmail(formData: ContactFormData): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('EmailJS is not properly configured. Please check your environment variables.');
    }

    if (!this.initialized) {
      this.initialize();
    }

    const templateParams = {
      from_name: formData.user_name,
      from_email: formData.user_email,
      phone: formData.phone || 'Not provided',
      company: formData.company || 'Not provided',
      project_type: formData.project_type,
      budget: formData.budget || 'Not specified',
      message: formData.message,
      reply_to: formData.user_email,
    };

    try {
      console.log("[v0] EmailJS send - serviceId:", this.config.serviceId);
      console.log("[v0] EmailJS send - templateId:", this.config.templateId);
      console.log("[v0] EmailJS send - publicKey:", this.config.publicKey);
      console.log("[v0] EmailJS send - templateParams:", templateParams);
      const response = await emailjs.send(
        this.config.serviceId,
        this.config.templateId,
        templateParams
      );
      
      console.log('Email sent successfully:', response);
      return response;
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send email. Please try again later.');
    }
  }

  public getStatus(): { configured: boolean; initialized: boolean } {
    return {
      configured: this.isConfigured(),
      initialized: this.initialized,
    };
  }
}

export const emailJSService = new EmailJSService();