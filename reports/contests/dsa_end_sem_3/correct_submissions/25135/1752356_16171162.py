def isPowerOfTwo(n):
    def f(x):
        if x == n:
            return True

        if x > n:
            return False

        return f(x*2)

    return f(1)