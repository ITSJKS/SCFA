def power(n):
    if n==1 or n==2:
        return True
    if n%2!=0 or n==0:
        return False
    return power(n//2)

def isPowerOfTwo(n):
    if power(n):
        return True
    return False