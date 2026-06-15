def isPowerOfTwo(n):
    if n == 0:
        return False
    return power(n)

def power(i):
    if i == 1:
        return True
    if int(i) == 1:
        return False
    return power(i/2)