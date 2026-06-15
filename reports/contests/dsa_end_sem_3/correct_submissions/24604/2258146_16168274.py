def findDifference(N, nums):
    odd, even = 0, 0
    for x in nums:
        if x % 2 == 0:
            even += x
        else:
            odd += x
    return even - odd