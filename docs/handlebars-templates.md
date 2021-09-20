# Handlebars

## Helpers

### `currentDateTime`

`currentDateTime` outputs a timestamp given a format parameter. There are a few special
format values:

- `ISODate` => `DateTime.now().toISODate()` (this is also the default)
- `ISO` => `DateTime.now().toISO()`
- `localeString` => `DateTime.now().toLocaleString()`
- Any other string will be passed like `DateTime.now().toFormat(string)`

For more information on formatting with the `currentDateTime` helper, see [Luxon's formatting documentation](https://github.com/moment/luxon/blob/master/docs/formatting.md).

### `capitalize`

`capitalize` takes a string and makes the first letter capitalized, and the rest lower case.

### `echo`

`echo` takes a string and simply returns it. This is useful if you want to use literal `{` or `}` characters in your template, like the default templates do.

## Variables

### Individual Changelog Entry Template

| Name         | Description                                                                                       | Required                                  |
| ------------ | ------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `changeType` | The change type for the entry, e.g. `NEW`, `IMPROVED`, `FIXED`, or custom ones you've configured. | `false`                                   |
| `message`    | The change log entry message.                                                                     | `true`                                    |
| `issueId`    | The issue ID. This is optional based on your config.                                              | `false` if `--requireIssueIds` is `false` |

### Global Changelog Template

| Name            | Description                                                                                                                                                                                                                            | Required                             |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `releaseNumber` | The release number or label, specified by `--releaseNumber` flag or from configuration file.                                                                                                                                           | `true`                               |
| `entryGroups`   | An array of objects with the interface `{ label: string; items: string[]; }` where `label` is the change type and `items` is all the entries with that change type. Will only be passed if your format template uses change type tags. | `true` if using change type tags     |
| `entries`       | An array of strings which are the individual changelog entries. This will be used if your format template does not use change type tags.                                                                                               | `true` if not using change type tags |

### Release Branch Pattern

| Name            | Description                                                                                 | Required |
| --------------- | ------------------------------------------------------------------------------------------- | -------- |
| `releaseNumber` | The release number or label, specified by `--releaseNumber` flag or from configuration file | `true`   |
