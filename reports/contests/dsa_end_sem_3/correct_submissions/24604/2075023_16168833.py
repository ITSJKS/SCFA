def findDifference(N, nums):
    even = 0
    odd = 0

    for i in range(N):
        if nums[i]%2 == 0:
            even += nums[i]
        else:
            odd += nums[i]

    return even - odd