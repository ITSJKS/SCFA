def isPowerOfTwo(n):
    def abc(x):
        if 2**x==n:
            return True
        if 2**x>n:
            return False
        return abc(x+1)
    return abc(0)