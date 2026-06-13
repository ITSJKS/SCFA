def FindSqrt(x):
    if x < 2:
        return x
    i = 1
    j = x//2
    while i <= j:
        mid = (i+j) // 2
        ans = mid * mid
        if ans == x :
            return mid
        elif ans <x :
            i = mid + 1
        else:
            j = mid - 1
    return j
    # for i in range(1, x//2+1):