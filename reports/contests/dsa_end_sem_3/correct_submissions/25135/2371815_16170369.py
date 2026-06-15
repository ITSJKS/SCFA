def isPowerOfTwo(n):
    def f(n):
        if(n==1):
            return True
        if(n<1):
            return False
        return f(n/2)
    return f(n)