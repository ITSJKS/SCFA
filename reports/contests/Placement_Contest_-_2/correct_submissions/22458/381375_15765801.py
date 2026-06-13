def FindSqrt(x):
    if x < 2:
        return x
    low = 1
    high = x//2
    while low <= high:
        mid = (high+low)//2
        square = mid * mid 
        if square == x:
            return mid
        elif square < x:
            low = mid + 1
        elif square > x:
            high = mid - 1
    return high
    # Complete the code here