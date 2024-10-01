import { Button, Grid, TextInput, Title } from '@mantine/core';
import { AddressAutocomplete } from '../AddressSearch';

export const Register = () => {
  const handleNext = () => {
    console.log('Registered');
  };

  return (
    <Grid style={{ marginTop: '7vh' }}>
      <Grid.Col span={12} style={{ marginBottom: '40px' }}>
        <Title order={3}>Registration</Title>
      </Grid.Col>
      <Grid.Col span={12}>
        <TextInput withAsterisk label="Name" placeholder="Type your name" />
      </Grid.Col>
      <Grid.Col span={12}>
        <TextInput withAsterisk label="Email" placeholder="Type your email" type="email" />
      </Grid.Col>
      <Grid.Col span={12}>
        <AddressAutocomplete />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}></Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Button fullWidth onClick={handleNext}>
          Next
        </Button>
      </Grid.Col>
    </Grid>
  );
};
