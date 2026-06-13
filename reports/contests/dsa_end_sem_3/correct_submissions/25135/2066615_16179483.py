def isPowerOfTwo(n):
    if n!=1 and n%2!=0:
        return False
    if n==0:
        return False
    if n==1:
        return True
    else:
        return isPowerOfTwo(n//2)