def findDifference(N, nums):
    odd = 0
    even = 0
    for i in range(N):
        if nums[i] % 2 != 0:
            odd += nums[i]
        else:
            even += nums[i]


    return even - odd