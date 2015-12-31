function importTest(name, path, provider) {
    describe(name, function () {
        require(path)(provider);
    });
}
describe("Provider Tests", function () {
    importTest("DocumentDB", './shared/core_test.js', require('../lib/documentdb_provider'));
    importTest("DynamoDB", './shared/core_test.js', require('../lib/dynamodb_provider'));
});