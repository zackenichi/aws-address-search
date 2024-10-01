import { useState } from 'react';
import { Autocomplete } from '@mantine/core';

interface PlaceResult {
  Text: string; // Add this line to include the Text property
  PlaceId: string; // Keep the PlaceId if you need it
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

// placeId will be used to fetch the address details

export const AddressAutocomplete: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<PlaceResult[]>([]); // Change type to PlaceResult[]

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
  const handleInputChange = (value: string) => {
    setQuery(value);
    if (value.length > 2) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]); // Clear suggestions if input is short
    }
  };

  const handleSuggestionSelect = (value: string) => {
    const selectedSuggestion = suggestions.find((suggestion) => suggestion.Text === value);
    if (selectedSuggestion) {
      fetchPlaceDetails(selectedSuggestion.PlaceId); // Fetch details using PlaceId
    }
    setQuery(value); // Set the query to the selected value
    setSuggestions([]); // Clear suggestions after selection

    console.log('Selected suggestion:', selectedSuggestion);
  };

  return (
    <Autocomplete
      withAsterisk
      value={query}
      onChange={handleInputChange}
      onOptionSubmit={handleSuggestionSelect}
      data={suggestions.map((suggestion) => suggestion.Text)} // Use the Text for display
      placeholder="Type your address, city, state, postcode"
      label="Address"
      styles={{ dropdown: { maxHeight: 200, overflow: 'auto' } }}
    />
  );
};
