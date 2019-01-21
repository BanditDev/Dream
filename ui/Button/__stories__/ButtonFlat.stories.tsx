import { withTests } from '@storybook/addon-jest';
import { text } from '@storybook/addon-knobs';
import * as React from 'react';
import results from '../../../.jest-test-results.json';

import { storiesOf } from '@storybook/react';
import { ButtonFlat } from '../';

storiesOf('UI/Button', module)
  .addDecorator(withTests({ results }))
  .add(
    'ButtonFlat',
    () => <ButtonFlat>{text('Title', 'ButtonFlat')}</ButtonFlat>,
    {
      jest: ['ButtonFlat.test.tsx']
    }
  );
