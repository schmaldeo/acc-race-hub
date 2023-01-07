# Inserting entrylists

This app's backend cannot work without an entrylist collection in the database.
Unfortunately, it doesn't yet support any way to generate it, so you need to use different tools (easiest might be hosting the signup on [TheSimGrid](https://thesimgrid.com/)).

Once you have the entrylist .json file, paste it into the `server` directory and run `node --experimental-json-modules ./insertEntrylist.js` in the `server` directory.
