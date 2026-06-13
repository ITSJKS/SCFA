def isPowerOfTwo(n):

    if n==1:
        return True
    elif n<1 or int(n)!=n:
        return False

    return isPowerOfTwo(n/2)