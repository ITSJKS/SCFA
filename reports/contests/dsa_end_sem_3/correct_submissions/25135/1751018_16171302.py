def isPowerOfTwo(n):

    def rec(target):
        if target==1:
            return True
        if target<1:
            return False

        return rec(target/2)

    return rec(n)