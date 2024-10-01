# Next.js with AWS Location Services

This project demonstrates how to use AWS Location Services for place autocomplete and fetching place details in a Next.js application.

## Prerequisites

- Node.js and npm installed
- AWS account
- AWS CLI configured

## Setup Instructions

1. **Create a Next.js Project**

   ```sh
   npx create-next-app@latest my-nextjs-app
   cd my-nextjs-app
   ```

2. **Install Dependencies**

   ```sh
   npm install @mantine/core
   ```

3. **Set Up AWS Location Services**

- Go to the AWS Management Console.
- Navigate to AWS Location Service.
- Create a new Place Index.
- Note down the Place Index name and the region.
- Configure Environment Variables

4. **Create a .env.local file in the root of your project and add your AWS API key:**

   ```sh
   NEXT_PUBLIC_API_KEY=your_aws_api_key
   ```

5. **Create API Routes**

Create two API routes for fetching suggestions and place details.

- pages/api/fetchSuggestions.ts

```ts
import type { NextApiRequest, NextApiResponse } from 'next';

interface PlaceResult {
  Text: string;
  PlaceId: string;
}

interface SearchResponse {
  Summary: {
    Text: string;
    MaxResults: number;
    DataSource: string;
  };
  Results: PlaceResult[];
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { text } = req.body;
  const placesName = 'your_place_index_name';
  const region = 'your_region';
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const url = `https://places.geo.${region}.amazonaws.com/places/v0/indexes/${placesName}/search/suggestions?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Text: text,
        MaxResults: 10,
      }),
    });

    if (response.ok) {
      const data: SearchResponse = await response.json();
      res.status(200).json(data);
    } else {
      res.status(response.status).json({ error: 'Failed to fetch suggestions' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default handler;
```

- pages/api/fetchPlaceDetails.ts

```ts
import type { NextApiRequest, NextApiResponse } from 'next';

interface PlaceDetailsResponse {
  Place: {
    Label: string; // Full address label
    Street: string; // Street address
    Municipality: string; // City
    SubRegion: string; // State
    PostalCode: string; // Postal Code
    Country: string; // Country
  };
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { placeId } = req.body;
  const placesName = 'your_place_index_name';
  const region = 'your_region';
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  if (!placeId) {
    return res.status(400).json({ error: 'Place ID is required' });
  }

  const url = `https://places.geo.${region}.amazonaws.com/places/v0/indexes/${placesName}/places/${placeId}?key=${apiKey}&language=en`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data: PlaceDetailsResponse = await response.json();
      res.status(200).json(data);
    } else {
      res.status(response.status).json({ error: 'Failed to fetch place details' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default handler;
```

6. **Update Your Component**

Update your AddressSearch.tsx component to use the new API routes:

```ts
import { useState } from 'react';
import { Autocomplete } from '@mantine/core';

interface PlaceResult {
  Text: string;
  PlaceId: string;
}

interface SearchResponse {
  Summary: {
    Text: string;
    MaxResults: number;
    DataSource: string;
  };
  Results: PlaceResult[];
}

interface PlaceDetailsResponse {
  Place: {
    Label: string; // Full address label
    Street: string; // Street address
    Municipality: string; // City
    SubRegion: string; // State
    PostalCode: string; // Postal Code
    Country: string; // Country
  };
}

export const AddressAutocomplete: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<PlaceResult[]>([]);

  const fetchSuggestions = async (text: string) => {
    try {
      const response = await fetch('/api/fetchSuggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const data: SearchResponse = await response.json();
        setSuggestions(data.Results);
      } else {
        console.error('Failed to fetch suggestions');
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const fetchPlaceDetails = async (placeId: string) => {
    try {
      const response = await fetch('/api/fetchPlaceDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ placeId }),
      });

      if (response.ok) {
        const data: PlaceDetailsResponse = await response.json();
        console.log(data);
      } else {
        console.error('Failed to fetch place details');
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  // Rest of your component logic
};
```

7. **Run Your Project**

Start your Next.js development server:

```sh
npm run dev
```

Open your browser and navigate to http://localhost:3000 to see your application in action.

## Conclusion

This setup allows you to use AWS Location Services for place autocomplete and fetching place details securely in a Next.js application. By moving the API key to the server side, you ensure that it is not exposed to the client, enhancing the security of your application.
