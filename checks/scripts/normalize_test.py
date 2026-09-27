import runpy, unittest
normalize = runpy.run_path("jobs/normalize.py")["normalize"]
class Normalize(unittest.TestCase):
    def test_contract(self):
        self.assertEqual(normalize("  Hello   WORLD  "), "hello world")
        self.assertEqual(normalize(" "), "")
if __name__ == "__main__": unittest.main()
