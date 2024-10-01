import { Stack } from '@mantine/core';
import { Register } from '@/components/Register';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '../components/Welcome/Welcome';

export default function HomePage() {
  return (
    <Stack align="center">
      <Welcome />
      <ColorSchemeToggle />
      <Register />
    </Stack>
  );
}
