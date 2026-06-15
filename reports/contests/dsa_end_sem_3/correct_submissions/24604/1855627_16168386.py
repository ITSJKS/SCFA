def findDifference(N, nums):
    se = 0
    so = 0
    for i in nums:
        if i%2==0:
            se+=i
        else:
            so+=i
    return (se-so)