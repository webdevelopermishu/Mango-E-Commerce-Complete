import * as migration_20261026_084826_initial from './20261026_084826_initial';
import * as migration_20261026_090000_integrity_constraints from './20261026_090000_integrity_constraints';
import * as migration_20261028_122748_videos_and_design from './20261028_122748_videos_and_design';
import * as migration_20261028_125937_localized_optional from './20261028_125937_localized_optional';

export const migrations = [
  {
    up: migration_20261026_084826_initial.up,
    down: migration_20261026_084826_initial.down,
    name: '20261026_084826_initial',
  },
  {
    up: migration_20261026_090000_integrity_constraints.up,
    down: migration_20261026_090000_integrity_constraints.down,
    name: '20261026_090000_integrity_constraints',
  },
  {
    up: migration_20261028_122748_videos_and_design.up,
    down: migration_20261028_122748_videos_and_design.down,
    name: '20261028_122748_videos_and_design',
  },
  {
    up: migration_20261028_125937_localized_optional.up,
    down: migration_20261028_125937_localized_optional.down,
    name: '20261028_125937_localized_optional'
  },
];
