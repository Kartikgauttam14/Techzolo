import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Extract the domain from the search parameters
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');

  // Validate that domain is provided
  if (!domain) {
    return NextResponse.json(
      { error: 'Domain parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Format the domain query properly
    const formattedDomain = domain.trim().toLowerCase();
    
    console.log(`Using mock data for domain: ${formattedDomain}`);
    
    // Create mock domain suggestions based on the input domain
    const domainParts = formattedDomain.split('.');
    const baseName = domainParts[0];
    const tlds = ['com', 'net', 'org', 'io', 'co', 'app', 'dev', 'tech', 'ai', 'me','in'];
    
    // Generate mock suggestions
    const mockSuggestions = tlds.map(tld => {
      const domainName = `${baseName}.${tld}`;
      const isAvailable = Math.random() > 0.3; // 70% chance of being available
      const priceValue = Math.floor(Math.random() * 1000) + 500; // Price between 500 and 1500
      return {
        domain: domainName,
        available: isAvailable,
        price: isAvailable ? `₹${priceValue}` : 'Not Available',
        priceValue: isAvailable ? priceValue : 0,
        definitive: true,
        tld: tld,
        id: `domain-${tld}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
      };
    });

    // Add some variations of the domain name
    const prefixes = ['my', 'get', 'try', 'the', 'best'];
    const suffixes = ['app', 'hub', 'pro', 'plus', 'zone'];
    
    for (let i = 0; i < 5; i++) {
      const usePrefix = Math.random() > 0.5;
      const useSuffix = !usePrefix || Math.random() > 0.7;
      
      let newName = baseName;
      if (usePrefix) {
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        newName = `${prefix}${baseName}`;
      }
      if (useSuffix) {
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        newName = `${newName}${suffix}`;
      }
      
      const tld = tlds[Math.floor(Math.random() * 3)]; // Use one of the first 3 TLDs
      const isAvailable = Math.random() > 0.2; // 80% chance of being available
      const priceValue = Math.floor(Math.random() * 1500) + 800; // Price between 800 and 2300
      
      mockSuggestions.push({
        domain: `${newName}.${tld}`,
        available: isAvailable,
        price: isAvailable ? `₹${priceValue}` : 'Not Available',
        priceValue: isAvailable ? priceValue : 0,
        definitive: true,
        tld: tld,
        id: `domain-var-${i}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
      });
    }
    
    // Shuffle the suggestions
    const shuffledSuggestions = mockSuggestions.sort(() => Math.random() - 0.5);
    
    return NextResponse.json({ suggestions: shuffledSuggestions });
  } catch (error) {
    console.error('Error generating domain suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to generate domain suggestions' },
      { status: 500 }
    );
  }
}