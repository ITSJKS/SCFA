def isPowerOfTwo(n):
    return f(0,n)
def f(i,n):
    if (2**i)>n:
        return False
    if (2**i)==n:
        return True
    return f(i+1,n)